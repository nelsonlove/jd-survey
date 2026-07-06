import { describe, it, expect } from "vitest";
import { makeFakeFs } from "./fs";

describe("makeFakeFs", () => {
  const fs = makeFakeFs({
    "/root": {
      "a.pdf": "file",
      "sub": { "b.txt": "file" },
      ".hidden": "file",
    },
  });

  it("reports directories", () => {
    expect(fs.isDirectory("/root")).toBe(true);
    expect(fs.isDirectory("/root/sub")).toBe(true);
    expect(fs.isDirectory("/root/a.pdf")).toBe(false);
    expect(fs.isDirectory("/nope")).toBe(false);
  });

  it("lists entries with type predicates", () => {
    const names = fs.readDir("/root").map((e) => e.name).sort();
    expect(names).toEqual([".hidden", "a.pdf", "sub"]);
    const sub = fs.readDir("/root").find((e) => e.name === "sub")!;
    expect(sub.isDirectory()).toBe(true);
    const a = fs.readDir("/root").find((e) => e.name === "a.pdf")!;
    expect(a.isFile()).toBe(true);
  });
});
