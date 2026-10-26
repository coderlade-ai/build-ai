"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { localePrefix, type Locale } from "@ladestack/i18n";
import type { Project, ProjectFile } from "@ladestack/shared-types";
import { workspace } from "../i18n/workspace";
import { getProjectStore } from "../storage/client";
import { buildFileTree, defaultFile, type TreeNode } from "../workspace/fileTree";
import { buildProjectZip, downloadZip, zipFileName } from "../export/zip";
import styles from "./Workspace.module.css";

// Monaco is heavy and browser-only: load it when a project opens, never on the welcome screen.
const CodeEditor = dynamic(() => import("../editor/CodeEditor").then((m) => m.CodeEditor), {
  ssr: false,
});

type Load = { state: "loading" } | { state: "missing" } | { state: "ready"; project: Project };
type Save = "saved" | "dirty" | "saving" | "error" | "conflict";

interface OpenFile {
  path: string;
  revision: string;
  content: string;
}

const autosaveDelayMs = 800;

/** Screen B (PRD A.13): full-screen Code or Preview over the local project store. */
export function Workspace({ locale }: { locale: Locale }) {
  const w = workspace[locale];
  const id = useSearchParams().get("id");
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [open, setOpen] = useState<OpenFile | null>(null);
  const [save, setSave] = useState<Save>("saved");
  const [view, setView] = useState<"code" | "preview">("code");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openRef = useRef(open);
  openRef.current = open;

  const openFile = useCallback(async (projectId: string, path: string) => {
    const store = await getProjectStore();
    const read = await store.readFile(projectId, path);
    if (read) setOpen({ path, revision: read.file.revision, content: read.content });
    setSave("saved");
  }, []);

  useEffect(() => {
    if (!id) {
      setLoad({ state: "missing" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const store = await getProjectStore();
        const project = await store.getProject(id);
        if (cancelled) return;
        if (!project) return setLoad({ state: "missing" });
        const list = await store.listFiles(id);
        if (cancelled) return;
        setFiles(list);
        setLoad({ state: "ready", project });
        const first = defaultFile(list.map((f) => f.path));
        if (first) await openFile(id, first);
      } catch {
        if (!cancelled) setLoad({ state: "missing" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, openFile]);

  const persist = useCallback(async () => {
    clearTimeout(timer.current);
    const current = openRef.current;
    if (!id || !current) return;
    setSave("saving");
    try {
      const store = await getProjectStore();
      const result = await store.writeFile(id, current.path, current.content, current.revision);
      if (result.ok) {
        // Keep typing that happened while saving: only advance the revision.
        setOpen((o) =>
          o && o.path === current.path ? { ...o, revision: result.file.revision } : o,
        );
        setFiles((list) => list.map((f) => (f.path === result.file.path ? result.file : f)));
        setSave(openRef.current?.content === current.content ? "saved" : "dirty");
      } else {
        setSave(result.reason === "conflict" ? "conflict" : "error");
      }
    } catch {
      setSave("error");
    }
  }, [id]);

  // Flush pending edits when the tab is hidden or closed.
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState === "hidden" && timer.current) void persist();
    };
    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, [persist]);

  function edit(content: string) {
    setOpen((o) => (o ? { ...o, content } : o));
    if (save === "conflict") return; // never autosave over a newer version
    setSave("dirty");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void persist(), autosaveDelayMs);
  }

  function saveNow() {
    if (save !== "conflict") void persist();
  }

  async function select(path: string) {
    if (!id || path === open?.path) return;
    if (save === "dirty") await persist();
    await openFile(id, path);
  }

  const [exporting, setExporting] = useState<"idle" | "busy" | "error">("idle");

  async function exportZip() {
    if (!id || load.state !== "ready") return;
    setExporting("busy");
    try {
      if (save === "dirty") await persist(); // export what the user sees, not a stale copy
      const store = await getProjectStore();
      const bytes = buildProjectZip(await store.readAllFiles(id));
      downloadZip(bytes, zipFileName(load.project.name));
      setExporting("idle");
    } catch {
      setExporting("error");
    }
  }

  const home = `${localePrefix(locale)}/`;

  if (load.state !== "ready") {
    return (
      <main className={styles.message}>
        <p role="status">{load.state === "loading" ? w.loading : id ? w.notFound : w.missingId}</p>
        {load.state === "missing" ? <Link href={home}>{w.back}</Link> : null}
      </main>
    );
  }

  const status: Record<Save, string> = {
    saved: w.saved,
    dirty: w.unsaved,
    saving: w.saving,
    error: w.saveError,
    conflict: w.conflict,
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.home} href={home} aria-label={w.back}>
          LadeStack <span>Build</span>
        </Link>
        <h1 className={styles.projectName}>{load.project.name}</h1>
        <div className={styles.views} role="group" aria-label={w.viewLabel}>
          {(["code", "preview"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              className={styles.viewButton}
              onClick={() => setView(v)}
            >
              {v === "code" ? w.code : w.preview}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.exportButton}
          onClick={() => void exportZip()}
          disabled={exporting === "busy"}
        >
          {exporting === "busy" ? w.exporting : w.exportZip}
        </button>
        <p className={styles.saveState} role="status" data-state={save}>
          {save === "conflict" || save === "error" ? null : status[save]}
        </p>
      </header>
      {exporting === "error" ? (
        <p className={styles.alert} role="alert">
          {w.exportError}
        </p>
      ) : null}
      {save === "conflict" || save === "error" ? (
        <div className={styles.alert} role="alert">
          <span>{status[save]}</span>
          {save === "conflict" && open ? (
            <button type="button" onClick={() => void openFile(id!, open.path)}>
              {w.reloadFile}
            </button>
          ) : null}
        </div>
      ) : null}
      {view === "code" ? (
        <div className={styles.code}>
          <nav className={styles.explorer} aria-label={w.files}>
            <p className={styles.explorerTitle}>{w.files}</p>
            <Tree
              nodes={buildFileTree(files.map((f) => f.path))}
              active={open?.path}
              onSelect={select}
            />
          </nav>
          <section className={styles.editorPane}>
            {open ? (
              <>
                <p className={styles.breadcrumb}>
                  {open.path}
                  {save === "dirty" ? <span aria-hidden="true"> ●</span> : null}
                </p>
                <div className={styles.editor}>
                  <CodeEditor
                    path={open.path}
                    value={open.content}
                    loadingLabel={w.editorLoading}
                    onChange={edit}
                    onSave={saveNow}
                  />
                </div>
              </>
            ) : (
              <p className={styles.empty}>{w.selectFile}</p>
            )}
          </section>
        </div>
      ) : (
        <div className={styles.preview}>
          <p>{w.previewUnavailable}</p>
        </div>
      )}
    </div>
  );
}

function Tree({
  nodes,
  active,
  onSelect,
}: {
  nodes: TreeNode[];
  active: string | undefined;
  onSelect: (path: string) => void;
}) {
  return (
    <ul className={styles.tree}>
      {nodes.map((n) =>
        n.children ? (
          <li key={n.path}>
            <details open>
              <summary className={styles.folder}>{n.name}</summary>
              <Tree nodes={n.children} active={active} onSelect={onSelect} />
            </details>
          </li>
        ) : (
          <li key={n.path}>
            <button
              type="button"
              className={styles.file}
              aria-current={n.path === active ? "true" : undefined}
              onClick={() => onSelect(n.path)}
            >
              {n.name}
            </button>
          </li>
        ),
      )}
    </ul>
  );
}
