import { useState } from "react";
import { wavelengthToTransition, H_ALPHA_NM } from "../../lib/physics";

type Labels = { aria: string; control: string; selected: string; transition: string };

const MIN_NM = 400;
const MAX_NM = 700;
// Prominent Fraunhofer lines across the visible band (nm).
const FRAUNHOFER = [430, 486, 517, 589, 656];

const toPercent = (nm: number) => ((nm - MIN_NM) / (MAX_NM - MIN_NM)) * 100;

export function SpectrumExplorer({ labels }: { labels: Labels }) {
  const [nm, setNm] = useState(H_ALPHA_NM);
  const t = wavelengthToTransition(nm);
  const pct = toPercent(nm);

  return (
    <div className="instrument-panel spectrum-explorer" role="group" aria-label={labels.aria}>
      <div className="spectrum-explorer__bar" aria-hidden="true">
        {FRAUNHOFER.map((w) => (
          <span
            key={w}
            className="spectrum-explorer__fraunhofer"
            style={{ left: `${toPercent(w)}%` }}
          />
        ))}
        <span className="spectrum-explorer__cursor" style={{ left: `${pct}%` }} />
      </div>

      {/* Implicit label association: input is nested inside label */}
      <label className="spectrum-explorer__control">
        <span>
          {labels.control}: {Math.round(nm)} nm
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
        {labels.selected}: {Math.round(nm)} nm — {labels.transition} n={t.from} → n={t.to}
      </p>
    </div>
  );
}
