import { describe, expect, it } from "vitest";
import { renderInlineMath } from "./math";

describe("renderInlineMath", () => {
  it("typesets common hydrogen spectral-line labels", () => {
    const html = renderInlineMath("Hα, Hβ, Hγ y Hδ");

    expect(html).toContain("katex");
    expect(html).not.toContain("Hγ");
    expect(html).toContain("α");
    expect(html).toContain("β");
    expect(html).toContain("γ");
    expect(html).toContain("δ");
  });
});
