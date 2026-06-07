import { describe, expect, it } from "vitest";
import glossaryTerm from "./GlossaryTerm.astro?raw";
import css from "../styles/global.css?raw";

describe("GlossaryTerm", () => {
  it("renders an accessible static tooltip contract", () => {
    expect(glossaryTerm).toContain("interface Props");
    expect(glossaryTerm).toContain("term: string;");
    expect(glossaryTerm).toContain("short: string;");
    expect(glossaryTerm).toContain("detail: string;");
    expect(glossaryTerm).toContain("id?: string;");
    expect(glossaryTerm).toMatch(/const\s+\{\s*term,\s*short,\s*detail,\s*id\s*\}\s*=\s*Astro\.props;/);
    expect(glossaryTerm).toContain("const tooltipSeed = id ?? term;");
    expect(glossaryTerm).toMatch(/toLowerCase\(\)\s*\.replace\(\s*\/\[\^a-z0-9\]\+\/g,\s*"[-]"\s*\)\s*\.replace\(\s*\/-\+\/g,\s*"[-]"\s*\)/s);
    expect(glossaryTerm).toMatch(/const tooltipId = sanitizedTooltipSeed\.startsWith\("glossary-"\)/);
    expect(glossaryTerm).toContain("`glossary-${sanitizedTooltipSeed}`");
    expect(glossaryTerm).not.toContain("`glossary-${term}`");
    expect(glossaryTerm).toMatch(/<span class="glossary-term">/);
    expect(glossaryTerm).toMatch(/<button class="glossary-term__trigger" type="button" aria-describedby=\{tooltipId\}>/);
    expect(glossaryTerm).toMatch(/<slot>\{term\}<\/slot>/);
    expect(glossaryTerm).toMatch(/<span class="glossary-term__popover" id=\{tooltipId\} role="tooltip">/);
    expect(glossaryTerm).toContain("<strong>{short}</strong>");
    expect(glossaryTerm).toContain("<span>{detail}</span>");
  });

  it("defines hover, focus, and mobile tooltip styles", () => {
    expect(css).toMatch(/\.glossary-term\s*\{[^}]*position:\s*relative;[^}]*display:\s*inline-flex;/s);
    expect(css).toMatch(/\.glossary-term__trigger\s*\{[^}]*border-bottom:\s*2px dotted color-mix\(in srgb, var\(--solar\), transparent 20%\);[^}]*cursor:\s*help;/s);
    expect(css).toMatch(/\.glossary-term__popover\s*\{[^}]*position:\s*absolute;[^}]*bottom:\s*calc\(100% \+ 10px\);[^}]*opacity:\s*0;[^}]*visibility:\s*hidden;[^}]*pointer-events:\s*none;/s);
    expect(css).toMatch(/\.glossary-term__trigger:hover \+ \.glossary-term__popover,\s*\.glossary-term__trigger:focus \+ \.glossary-term__popover\s*\{[^}]*opacity:\s*1;[^}]*visibility:\s*visible;/s);
    expect(css).toMatch(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.glossary-term\s*\{[^}]*position:\s*static;[^}]*\}[\s\S]*\.glossary-term__popover\s*\{[^}]*position:\s*fixed;[^}]*left:\s*18px;[^}]*right:\s*18px;[^}]*bottom:\s*18px;[^}]*width:\s*auto;[^}]*transform:\s*none;/);
  });

  it("uses the KaTeX text face as the global site typography", () => {
    expect(css).toMatch(/--font-body:\s*"KaTeX_Main"/);
    expect(css).toMatch(/--font-display:\s*"KaTeX_Main"/);
    expect(css).toMatch(/\.katex\s*\{[^}]*font-size:\s*1em;/s);
  });
});
