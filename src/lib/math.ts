import katex from "katex";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMath = (value: string, displayMode: boolean) =>
  katex.renderToString(value, {
    displayMode,
    output: "html",
    strict: "ignore",
    throwOnError: false,
  });

export function renderInlineMath(value: string): string {
  const parts: string[] = [];
  let cursor = 0;
  const pattern = /\\\((.+?)\\\)|\$([^$]+)\$/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    parts.push(escapeHtml(value.slice(cursor, match.index)));
    parts.push(renderMath(match[1] ?? match[2] ?? "", false));
    cursor = match.index + match[0].length;
  }

  parts.push(escapeHtml(value.slice(cursor)));
  return parts.join("");
}

export function renderDisplayMath(value: string): string {
  return renderMath(value, true);
}
