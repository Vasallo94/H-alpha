import { describe, expect, it } from "vitest";
import glossaryTerm from "./GlossaryTerm.astro?raw";
import css from "../styles/global.css?raw";

describe("GlossaryTerm", () => {
  it("renders an accessible static tooltip contract", () => {
    expect(glossaryTerm).toContain("interface Props");
    expect(glossaryTerm).toContain("term: string;");
    expect(glossaryTerm).toContain("short: string;");
    expect(glossaryTerm).toContain("detail: string;");
    expect(glossaryTerm).toMatch(/const\s+\{\s*term,\s*short,\s*detail\s*\}\s*=\s*Astro\.props;/);
    expect(glossaryTerm).toMatch(/<span class="glossary-term">/);
    expect(glossaryTerm).toMatch(/<button class="glossary-term__trigger" type="button" aria-describedby=\{`glossary-\$\{term\}`\}>/);
    expect(glossaryTerm).toMatch(/<slot>\{term\}<\/slot>/);
    expect(glossaryTerm).toMatch(/<span class="glossary-term__popover" id=\{`glossary-\$\{term\}`\} role="tooltip">/);
    expect(glossaryTerm).toContain("<strong>{short}</strong>");
    expect(glossaryTerm).toContain("<span>{detail}</span>");
  });

  it("defines hover, focus, and mobile tooltip styles", () => {
    expect(css).toMatch(/\.glossary-term\s*\{[^}]*position:\s*relative;[^}]*display:\s*inline-flex;/s);
    expect(css).toMatch(/\.glossary-term__trigger\s*\{[^}]*border-bottom:\s*2px dotted color-mix\(in srgb, var\(--solar\), transparent 20%\);[^}]*cursor:\s*help;/s);
    expect(css).toMatch(/\.glossary-term__popover\s*\{[^}]*position:\s*absolute;[^}]*bottom:\s*calc\(100% \+ 10px\);[^}]*opacity:\s*0;[^}]*pointer-events:\s*none;/s);
    expect(css).toMatch(/\.glossary-term__trigger:hover \+ \.glossary-term__popover,\s*\.glossary-term__trigger:focus \+ \.glossary-term__popover\s*\{[^}]*opacity:\s*1;/s);
    expect(css).toMatch(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.glossary-term__popover\s*\{[^}]*left:\s*0;[^}]*transform:\s*none;/);
  });
});
