export interface TreeNode {
  name: string;
  /** Full logical path; for folders, the folder path. */
  path: string;
  children?: TreeNode[];
}

/** Builds a sorted explorer tree (folders first, then files, each alphabetical). */
export function buildFileTree(paths: readonly string[]): TreeNode[] {
  const root: TreeNode = { name: "", path: "", children: [] };
  for (const full of paths) {
    const parts = full.split("/");
    let node = root;
    parts.forEach((name, i) => {
      const path = parts.slice(0, i + 1).join("/");
      const isFile = i === parts.length - 1;
      let child = node.children!.find((c) => c.name === name && !c.children === isFile);
      if (!child) {
        child = isFile ? { name, path } : { name, path, children: [] };
        node.children!.push(child);
      }
      node = child;
    });
  }
  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .sort((a, b) =>
        !!a.children === !!b.children ? a.name.localeCompare(b.name) : a.children ? -1 : 1,
      )
      .map((n) => (n.children ? { ...n, children: sort(n.children) } : n));
  return sort(root.children!);
}

/** Picks the file to open first: the app entry when there is one, else the first file. */
export function defaultFile(paths: readonly string[]): string | undefined {
  for (const p of ["src/App.tsx", "src/App.jsx", "index.html"]) if (paths.includes(p)) return p;
  return [...paths].sort()[0];
}
