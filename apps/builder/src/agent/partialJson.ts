/**
 * Reads one string field out of tool-call arguments that are still streaming in, e.g.
 * `{"path":"src/App.tsx","content":"import Re` -> content "import Re". Returns undefined until the
 * field's opening quote has arrived. Never throws; an incomplete escape at the end is dropped.
 */
export function partialStringField(raw: string, field: string): string | undefined {
  const key = new RegExp(`"${field}"\\s*:\\s*"`, "g");
  const match = key.exec(raw);
  if (!match) return undefined;
  let out = "";
  for (let i = match.index + match[0].length; i < raw.length; i++) {
    const ch = raw[i]!;
    if (ch === '"') return out;
    if (ch !== "\\") {
      out += ch;
      continue;
    }
    const next = raw[i + 1];
    if (next === undefined) return out;
    const simple: Record<string, string> = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "\t",
    };
    if (next in simple) {
      out += simple[next];
      i++;
    } else if (next === "u") {
      const hex = raw.slice(i + 2, i + 6);
      if (hex.length < 4) return out;
      const code = Number.parseInt(hex, 16);
      if (Number.isNaN(code)) return out;
      out += String.fromCharCode(code);
      i += 5;
    } else {
      i++; // unknown escape: skip it
    }
  }
  return out;
}
