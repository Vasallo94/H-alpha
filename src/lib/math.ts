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

const spectralLineMath: Record<string, string> = {
  Hα: "\\mathrm{H}\\alpha",
  Hβ: "\\mathrm{H}\\beta",
  Hγ: "\\mathrm{H}\\gamma",
  Hδ: "\\mathrm{H}\\delta",
};

const renderTextChunk = (value: string) =>
  value
    .split(/(H[αβγδ])/g)
    .map((part) => (spectralLineMath[part] ? renderMath(spectralLineMath[part], false) : escapeHtml(part)))
    .join("");

export function renderInlineMath(value: string): string {
  const parts: string[] = [];
  let cursor = 0;
  const pattern = /\\\((.+?)\\\)|\$([^$]+)\$/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    parts.push(renderTextChunk(value.slice(cursor, match.index)));
    parts.push(renderMath(match[1] ?? match[2] ?? "", false));
    cursor = match.index + match[0].length;
  }

  parts.push(renderTextChunk(value.slice(cursor)));
  return parts.join("");
}

export function renderDisplayMath(value: string): string {
  return renderMath(value, true);
}
