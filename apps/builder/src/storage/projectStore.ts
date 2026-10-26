import type { Checkpoint, Project, ProjectFile, ProjectProfile } from "@ladestack/shared-types";
import { isSafeProjectPath } from "../templates/validate";

/**
 * Local-first project store on IndexedDB (PRD A.20). The revisioned file records here are the
 * source of truth; Monaco and the runtime only ever hold copies.
 *
 * Stores: `projects` (Project), `projectFiles` (ProjectFile, key [projectId, path]) and
 * `fileBlobs` (content-addressed by SHA-256), plus `checkpoints` (path -> hash manifests) since v2.
 * Blobs are never deleted while any checkpoint may reference them. Writes use optimistic concurrency: a caller passes
 * the revision it edited, and a mismatch is reported as a conflict instead of last-write-wins.
 */

export const dbName = "ladestack-build";
export const dbVersion = 2;
/** Newest checkpoints kept per project; older ones are pruned when a new one is taken. */
export const maxCheckpoints = 20;

export interface FileBlob {
  hash: string;
  content: string;
}

export type WriteResult =
  | { ok: true; file: ProjectFile }
  | { ok: false; reason: "conflict"; current: ProjectFile | undefined }
  | { ok: false; reason: "invalid-path" | "missing-project" };

export type RestoreResult =
  | { ok: true; changed: number; safety: Checkpoint }
  | { ok: false; reason: "missing-checkpoint" | "missing-content" };

const newestFirst = (a: Checkpoint, b: Checkpoint) =>
  a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;

export function openProjectDb(
  factory: IDBFactory = indexedDB,
  name = dbName,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = factory.open(name, dbVersion);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (e.oldVersion < 1) {
        db.createObjectStore("projects", { keyPath: "id" });
        const files = db.createObjectStore("projectFiles", { keyPath: ["projectId", "path"] });
        files.createIndex("byProject", "projectId");
        db.createObjectStore("fileBlobs", { keyPath: "hash" });
      }
      if (e.oldVersion < 2) {
        const checkpoints = db.createObjectStore("checkpoints", { keyPath: "id" });
        checkpoints.createIndex("byProject", "projectId");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("Project database upgrade is blocked by another tab."));
  });
}

export async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted"));
  });
}

const nextRevision = (r: string | undefined) => String((r ? Number(r) : 0) + 1);
const byteLength = (s: string) => new TextEncoder().encode(s).length;

export class ProjectStore {
  constructor(
    private readonly db: IDBDatabase,
    private readonly now: () => Date = () => new Date(),
  ) {}

  /** Creates a project and its files atomically. Paths are validated before anything is written. */
  async createProject(input: {
    name: string;
    profile: ProjectProfile;
    files: Record<string, string>;
    outputLanguage?: string;
  }): Promise<Project> {
    const paths = Object.keys(input.files);
    const bad = paths.find((p) => !isSafeProjectPath(p));
    if (bad !== undefined) throw new Error(`Unsafe project path: ${bad}`);
    // Hash first: a transaction commits as soon as it waits on anything that is not IndexedDB.
    const hashes = await Promise.all(paths.map((p) => sha256(input.files[p]!)));
    const at = this.now().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      name: input.name,
      profile: input.profile,
      outputLanguage: input.outputLanguage ?? "en",
      createdAt: at,
      updatedAt: at,
      headRevision: "1",
    };
    const tx = this.db.transaction(["projects", "projectFiles", "fileBlobs"], "readwrite");
    tx.objectStore("projects").add(project);
    paths.forEach((path, i) => {
      const content = input.files[path]!;
      tx.objectStore("fileBlobs").put({ hash: hashes[i]!, content } satisfies FileBlob);
      tx.objectStore("projectFiles").add({
        id: crypto.randomUUID(),
        projectId: project.id,
        path,
        contentHash: hashes[i]!,
        size: byteLength(content),
        revision: "1",
      } satisfies ProjectFile);
    });
    await done(tx);
    return project;
  }

  async listProjects(): Promise<Project[]> {
    const tx = this.db.transaction("projects");
    const all = await request(tx.objectStore("projects").getAll() as IDBRequest<Project[]>);
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getProject(id: string): Promise<Project | undefined> {
    const tx = this.db.transaction("projects");
    return request(tx.objectStore("projects").get(id) as IDBRequest<Project | undefined>);
  }

  async listFiles(projectId: string): Promise<ProjectFile[]> {
    const tx = this.db.transaction("projectFiles");
    const idx = tx.objectStore("projectFiles").index("byProject");
    const files = await request(idx.getAll(projectId) as IDBRequest<ProjectFile[]>);
    return files.sort((a, b) => a.path.localeCompare(b.path));
  }

  async readFile(
    projectId: string,
    path: string,
  ): Promise<{ file: ProjectFile; content: string } | undefined> {
    const tx = this.db.transaction(["projectFiles", "fileBlobs"]);
    const file = await request(
      tx.objectStore("projectFiles").get([projectId, path]) as IDBRequest<ProjectFile | undefined>,
    );
    if (!file) return undefined;
    const blob = await request(
      tx.objectStore("fileBlobs").get(file.contentHash) as IDBRequest<FileBlob | undefined>,
    );
    if (!blob) throw new Error(`Missing content for ${path}`);
    return { file, content: blob.content };
  }

  /** Every file with its content, read in one transaction so the snapshot is consistent. */
  async readAllFiles(projectId: string): Promise<{ path: string; content: string }[]> {
    const tx = this.db.transaction(["projectFiles", "fileBlobs"]);
    const files = await request(
      tx.objectStore("projectFiles").index("byProject").getAll(projectId) as IDBRequest<
        ProjectFile[]
      >,
    );
    const blobs = tx.objectStore("fileBlobs");
    const out = await Promise.all(
      files.map(async (file) => {
        const blob = await request(blobs.get(file.contentHash) as IDBRequest<FileBlob | undefined>);
        if (!blob) throw new Error(`Missing content for ${file.path}`);
        return { path: file.path, content: blob.content };
      }),
    );
    return out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  }

  /**
   * Writes a file if `baseRevision` matches what is stored (`null` means "must not exist yet").
   * Never overwrites a newer revision: the caller gets the current record back as a conflict.
   */
  async writeFile(
    projectId: string,
    path: string,
    content: string,
    baseRevision: string | null,
  ): Promise<WriteResult> {
    if (!isSafeProjectPath(path)) return { ok: false, reason: "invalid-path" };
    const hash = await sha256(content);
    const tx = this.db.transaction(["projects", "projectFiles", "fileBlobs"], "readwrite");
    const projects = tx.objectStore("projects");
    const files = tx.objectStore("projectFiles");
    const project = await request(projects.get(projectId) as IDBRequest<Project | undefined>);
    if (!project) {
      tx.abort();
      return { ok: false, reason: "missing-project" };
    }
    const current = await request(
      files.get([projectId, path]) as IDBRequest<ProjectFile | undefined>,
    );
    if ((current?.revision ?? null) !== baseRevision) {
      tx.abort();
      return { ok: false, reason: "conflict", current };
    }
    const file: ProjectFile = {
      id: current?.id ?? crypto.randomUUID(),
      projectId,
      path,
      contentHash: hash,
      size: byteLength(content),
      revision: nextRevision(current?.revision),
    };
    tx.objectStore("fileBlobs").put({ hash, content } satisfies FileBlob);
    files.put(file);
    projects.put({
      ...project,
      updatedAt: this.now().toISOString(),
      headRevision: nextRevision(project.headRevision),
    });
    await done(tx);
    return { ok: true, file };
  }

  /** Deletes a file if it is still at `baseRevision`. Blobs are left for a later collection pass. */
  async deleteFile(projectId: string, path: string, baseRevision: string): Promise<WriteResult> {
    const tx = this.db.transaction(["projects", "projectFiles"], "readwrite");
    const projects = tx.objectStore("projects");
    const files = tx.objectStore("projectFiles");
    const project = await request(projects.get(projectId) as IDBRequest<Project | undefined>);
    const current = await request(
      files.get([projectId, path]) as IDBRequest<ProjectFile | undefined>,
    );
    if (!project) {
      tx.abort();
      return { ok: false, reason: "missing-project" };
    }
    if (!current || current.revision !== baseRevision) {
      tx.abort();
      return { ok: false, reason: "conflict", current };
    }
    files.delete([projectId, path]);
    projects.put({
      ...project,
      updatedAt: this.now().toISOString(),
      headRevision: nextRevision(project.headRevision),
    });
    await done(tx);
    return { ok: true, file: current };
  }

  async renameProject(projectId: string, name: string): Promise<Project | undefined> {
    const tx = this.db.transaction("projects", "readwrite");
    const store = tx.objectStore("projects");
    const project = await request(store.get(projectId) as IDBRequest<Project | undefined>);
    if (!project) return undefined;
    const updated = { ...project, name, updatedAt: this.now().toISOString() };
    store.put(updated);
    await done(tx);
    return updated;
  }

  /** Removes a project, its file records and checkpoints. Callers must confirm with the user first. */
  async deleteProject(projectId: string): Promise<void> {
    const tx = this.db.transaction(["projects", "projectFiles", "checkpoints"], "readwrite");
    tx.objectStore("projects").delete(projectId);
    for (const name of ["projectFiles", "checkpoints"]) {
      const store = tx.objectStore(name);
      const keys = await request(store.index("byProject").getAllKeys(projectId));
      for (const key of keys) store.delete(key);
    }
    await done(tx);
  }

  /**
   * Records the project's current files as a manifest (PRD A.20 checkpoints). Cheap: blobs are
   * shared by hash, so only the path -> hash map is stored. Keeps the newest `maxCheckpoints`.
   */
  async createCheckpoint(
    projectId: string,
    label: string,
    reason: Checkpoint["reason"],
  ): Promise<Checkpoint | undefined> {
    const tx = this.db.transaction(["projects", "projectFiles", "checkpoints"], "readwrite");
    const project = await request(
      tx.objectStore("projects").get(projectId) as IDBRequest<Project | undefined>,
    );
    if (!project) {
      tx.abort();
      return undefined;
    }
    const files = await request(
      tx.objectStore("projectFiles").index("byProject").getAll(projectId) as IDBRequest<
        ProjectFile[]
      >,
    );
    const checkpoint: Checkpoint = {
      id: crypto.randomUUID(),
      projectId,
      label,
      createdAt: this.now().toISOString(),
      reason,
      manifest: Object.fromEntries(files.map((f) => [f.path, f.contentHash])),
    };
    const store = tx.objectStore("checkpoints");
    const existing = await request(
      store.index("byProject").getAll(projectId) as IDBRequest<Checkpoint[]>,
    );
    store.add(checkpoint);
    for (const old of existing.sort(newestFirst).slice(maxCheckpoints - 1)) store.delete(old.id);
    await done(tx);
    return checkpoint;
  }

  /** Newest first. */
  async listCheckpoints(projectId: string): Promise<Checkpoint[]> {
    const tx = this.db.transaction("checkpoints");
    const all = await request(
      tx.objectStore("checkpoints").index("byProject").getAll(projectId) as IDBRequest<
        Checkpoint[]
      >,
    );
    return all.sort(newestFirst);
  }

  /**
   * Puts the project's files back to a checkpoint. A "before-restore" checkpoint is taken first
   * so the restore itself can be undone. Restoring is an explicit user action, so it replaces
   * newer revisions; every changed file still gets a new revision so open editors see a conflict.
   */
  async restoreCheckpoint(projectId: string, checkpointId: string): Promise<RestoreResult> {
    const target = await request(
      this.db.transaction("checkpoints").objectStore("checkpoints").get(checkpointId) as IDBRequest<
        Checkpoint | undefined
      >,
    );
    if (!target || target.projectId !== projectId)
      return { ok: false, reason: "missing-checkpoint" };
    const safety = await this.createCheckpoint(projectId, target.label, "before-restore");
    if (!safety) return { ok: false, reason: "missing-checkpoint" };

    const tx = this.db.transaction(["projects", "projectFiles", "fileBlobs"], "readwrite");
    const projects = tx.objectStore("projects");
    const filesStore = tx.objectStore("projectFiles");
    const blobs = tx.objectStore("fileBlobs");
    const project = await request(projects.get(projectId) as IDBRequest<Project | undefined>);
    const current = await request(
      filesStore.index("byProject").getAll(projectId) as IDBRequest<ProjectFile[]>,
    );
    if (!project) {
      tx.abort();
      return { ok: false, reason: "missing-checkpoint" };
    }
    const byPath = new Map(current.map((f) => [f.path, f]));
    let changed = 0;
    for (const f of current)
      if (!(f.path in target.manifest)) {
        filesStore.delete([projectId, f.path]);
        changed++;
      }
    for (const [path, hash] of Object.entries(target.manifest)) {
      const now = byPath.get(path);
      if (now?.contentHash === hash) continue;
      const blob = await request(blobs.get(hash) as IDBRequest<FileBlob | undefined>);
      if (!blob) {
        tx.abort();
        return { ok: false, reason: "missing-content" };
      }
      filesStore.put({
        id: now?.id ?? crypto.randomUUID(),
        projectId,
        path,
        contentHash: hash,
        size: byteLength(blob.content),
        revision: nextRevision(now?.revision),
      } satisfies ProjectFile);
      changed++;
    }
    projects.put({
      ...project,
      updatedAt: this.now().toISOString(),
      headRevision: nextRevision(project.headRevision),
    });
    await done(tx);
    return { ok: true, changed, safety };
  }
}
