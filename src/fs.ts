export interface DirEntry {
  name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

export interface FsLike {
  isDirectory(absPath: string): boolean;
  readDir(absPath: string): DirEntry[];
}

// Real adapter — only constructed at runtime on desktop.
export class NodeFs implements FsLike {
  private fs = require("fs") as typeof import("fs");
  isDirectory(absPath: string): boolean {
    try { return this.fs.statSync(absPath).isDirectory(); }
    catch { return false; }
  }
  readDir(absPath: string): DirEntry[] {
    const ents = this.fs.readdirSync(absPath, { withFileTypes: true });
    return ents.map((e) => ({
      name: e.name,
      isDirectory: () => e.isDirectory(),
      isFile: () => e.isFile(),
    }));
  }
}

// ---- test helper ----
export type FakeNode = { [name: string]: FakeNode | "file" };

export function makeFakeFs(root: Record<string, FakeNode>): FsLike {
  function lookup(absPath: string): FakeNode | "file" | undefined {
    const parts = absPath.split("/").filter(Boolean);
    let node: any = { "": root }[""]; // start at root map
    // find the top-level key that matches "/<first>"
    // root is keyed by absolute top paths like "/root"
    for (const [k, v] of Object.entries(root)) {
      const kp = k.split("/").filter(Boolean);
      if (kp.every((seg, i) => parts[i] === seg)) {
        node = v;
        let rest = parts.slice(kp.length);
        for (const seg of rest) {
          if (node === "file" || node[seg] === undefined) return undefined;
          node = node[seg];
        }
        return node;
      }
    }
    return undefined;
  }
  return {
    isDirectory(absPath) {
      const n = lookup(absPath);
      return typeof n === "object" && n !== undefined;
    },
    readDir(absPath) {
      const n = lookup(absPath);
      if (typeof n !== "object" || n === undefined) return [];
      return Object.entries(n).map(([name, v]) => ({
        name,
        isDirectory: () => typeof v === "object",
        isFile: () => v === "file",
      }));
    },
  };
}
