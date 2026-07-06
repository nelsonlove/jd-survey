export function formatDate(d: Date, fmt: string): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return fmt
    .replace(/YYYY/g, String(d.getFullYear()))
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()));
}

export function parseDate(v: unknown, fmt = "YYYY-MM-DD"): Date | null {
  if (v instanceof Date) return v;
  if (typeof v !== "string") return null;
  const tokens = fmt.match(/YYYY|MM|DD|[^YMD]+/g) || [];
  let pattern = "^";
  const order: Array<"Y" | "M" | "D"> = [];
  for (const tk of tokens) {
    if (tk === "YYYY") { pattern += "(\\d{4})"; order.push("Y"); }
    else if (tk === "MM") { pattern += "(\\d{2})"; order.push("M"); }
    else if (tk === "DD") { pattern += "(\\d{2})"; order.push("D"); }
    else pattern += tk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  const m = new RegExp(pattern).exec(v);
  if (!m) return null;
  let y = 0, mo = 1, d = 1;
  order.forEach((t, i) => {
    const n = Number(m[i + 1]);
    if (t === "Y") y = n; else if (t === "M") mo = n; else d = n;
  });
  if (!y) return null;
  return new Date(y, mo - 1, d);
}

export function daysBetween(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / ms);
}
