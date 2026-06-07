import { useState } from "react";
import { SPECTRAL_LINES, nearestLine, H_ALPHA_NM } from "../../lib/physics";
import { renderInlineMath } from "../../lib/math";

type Labels = {
  aria: string;
  control: string;
  selected: string;
  hydrogenTransition: string;
  notHydrogen: string;
  continuum: string;
  elements: { H: string; Mg: string; Na: string; Ca: string };
};

const MIN_NM = 400;
const MAX_NM = 700;

const toPercent = (nm: number) => ((nm - MIN_NM) / (MAX_NM - MIN_NM)) * 100;

function MathInline({ value }: { value: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderInlineMath(value) }} />;
}

export function SpectrumExplorer({ labels }: { labels: Labels }) {
  const [nm, setNm] = useState(H_ALPHA_NM);
  const line = nearestLine(nm);
  const pct = toPercent(nm);

  // Build the readout message
  let readout: string;
  if (line === null) {
    readout = labels.continuum;
  } else if (line.element === "H" && line.transition) {
    readout = `${line.label} — ${labels.hydrogenTransition}: \\(n=${line.transition.from} \\to n=${line.transition.to}\\) (\\(${line.nm}\\,\\mathrm{nm}\\))`;
  } else {
    const elementName = labels.elements[line.element] ?? line.element;
    readout = `${line.label} — ${elementName} — ${labels.notHydrogen} (\\(${line.nm}\\,\\mathrm{nm}\\))`;
  }

  return (
    <div className="instrument-panel spectrum-explorer" role="group" aria-label={labels.aria}>
      <div className="spectrum-explorer__bar" aria-hidden="true">
        {SPECTRAL_LINES.map((l) => (
          <span
            key={l.nm}
            className={[
              "spectrum-explorer__fraunhofer",
              l.element === "H" ? "spectrum-explorer__fraunhofer--hydrogen" : "",
              line !== null && Math.abs(l.nm - nm) <= 5
                ? "spectrum-explorer__fraunhofer--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ left: `${toPercent(l.nm)}%` }}
          />
        ))}
        <span className="spectrum-explorer__cursor" style={{ left: `${pct}%` }} />
      </div>

      {/* Implicit label association: input is nested inside label */}
      <label className="spectrum-explorer__control">
        <span>
          {labels.control}: <MathInline value={`\\(${Math.round(nm)}\\,\\mathrm{nm}\\)`} />
        </span>
        <input
          aria-label={labels.control}
          type="range"
          min={MIN_NM}
          max={MAX_NM}
          step={1}
          value={Math.round(nm)}
          onChange={(e) => setNm(Number(e.target.value))}
          onInput={(e) => setNm(Number(e.currentTarget.value))}
        />
      </label>

      {/* aria-live region for screen readers; no id needed */}
      <p className="spectrum-explorer__readout" aria-live="polite">
        {labels.selected}: <MathInline value={`\\(${Math.round(nm)}\\,\\mathrm{nm}\\)`} /> — <MathInline value={readout} />
      </p>
    </div>
  );
}
