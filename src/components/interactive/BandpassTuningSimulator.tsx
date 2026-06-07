import { useState } from "react";
import { contrastUnderWindow, classifyView, transmissionWindow, gaussian } from "../../lib/physics";

type Labels = {
  aria: string;
  width: string;
  offset: string;
  contrast: string;
  explanation: string;
  views: { disk: string; prominence: string; washed: string };
};

const MIN_FWHM = 0.3;
const MAX_FWHM = 1.2;
const DEFAULT_FWHM = 0.4;
const MIN_OFFSET = -0.6;
const MAX_OFFSET = 0.6;
const DEFAULT_OFFSET = 0;

// Plot spans -1.5 .. +1.5 Å around line center, sampled across 60 points.
const SAMPLES = Array.from({ length: 60 }, (_, i) => -1.5 + (i * 3) / 59);

export function BandpassTuningSimulator({ labels }: { labels: Labels }) {
  const [fwhm, setFwhm] = useState(DEFAULT_FWHM);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);

  const view = classifyView({ centerOffset: offset, fwhm });
  const wing = offset < -0.05 ? "blue-wing" : offset > 0.05 ? "red-wing" : "line-center";
  const contrast = contrastUnderWindow({ centerOffset: offset, fwhm });

  // y maps a 0..1 transmission to plot coordinates (top = high transmission).
  const lineY = (d: number) => 100 - 70 * (1 - 0.85 * gaussian(d, 0, 0.21)); // absorption dip
  const winY = (d: number) => 100 - 70 * transmissionWindow(d, { centerOffset: offset, fwhm });
  const toX = (d: number) => ((d + 1.5) / 3) * 300;

  return (
    <div className="instrument-panel bandpass-sim" role="group" aria-label={labels.aria}>
      <svg viewBox="0 0 300 110" className="bandpass-sim__plot" aria-hidden="true">
        <polyline
          fill="none"
          stroke="var(--instrument)"
          strokeWidth={2}
          points={SAMPLES.map((d) => `${toX(d)},${lineY(d)}`).join(" ")}
        />
        <polyline
          fill="none"
          stroke="var(--solar)"
          strokeWidth={2}
          points={SAMPLES.map((d) => `${toX(d)},${winY(d)}`).join(" ")}
        />
      </svg>

      <div className="bandpass-sim__controls">
        {/* Implicit label association: inputs are nested inside their labels */}
        <label>
          <span>
            {labels.width}: {fwhm.toFixed(2)} Å
          </span>
          <input
            type="range"
            min={MIN_FWHM}
            max={MAX_FWHM}
            step={0.05}
            value={fwhm}
            aria-label={labels.width}
            onChange={(e) => setFwhm(Number(e.target.value))}
            onInput={(e) => setFwhm(Number(e.currentTarget.value))}
          />
        </label>

        <label>
          <span>
            {labels.offset}: {offset.toFixed(2)} Å
          </span>
          <input
            type="range"
            min={MIN_OFFSET}
            max={MAX_OFFSET}
            step={0.05}
            value={offset}
            aria-label={labels.offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            onInput={(e) => setOffset(Number(e.currentTarget.value))}
          />
        </label>
      </div>

      {/* aria-live region for screen readers; no id needed */}
      <p className="bandpass-sim__readout" aria-live="polite">
        {labels.contrast}: {(contrast * 100).toFixed(0)}% — {labels.views[view]}
      </p>
      <p className="bandpass-sim__note">{labels.explanation}</p>

      <div className={`bandpass-sim__preview bandpass-sim__preview--${view} bandpass-sim__preview--${wing}`} aria-hidden="true" />
    </div>
  );
}
