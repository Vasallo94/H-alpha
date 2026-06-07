import { useId, useMemo, useState } from "react";

type BandpassTuningSimulatorCopy = {
  ariaLabel: string;
  widthLabel: string;
  offsetLabel: string;
  widthReadoutLabel: string;
  offsetReadoutLabel: string;
  resultReadoutLabel: string;
  centerLabel: string;
  windowLabel: string;
  helpText: string;
  results: {
    offBand: string;
    narrow: string;
    wide: string;
  };
};

type BandpassTuningSimulatorProps = {
  copy: BandpassTuningSimulatorCopy;
};

const MIN_WIDTH = 0.3;
const MAX_WIDTH = 1.2;
const DEFAULT_WIDTH = 0.5;
const MIN_OFFSET = -0.5;
const MAX_OFFSET = 0.5;
const DEFAULT_OFFSET = 0;
const PLOT_RANGE = 1.6;

type RangeInputEvent = {
  currentTarget: HTMLInputElement;
};

export type BandpassState = "offBand" | "narrow" | "wide";

export const classifyBandpassState = (width: number, offset: number): BandpassState => {
  if (Math.abs(offset) > width / 2) return "offBand";
  if (width <= 0.5) return "narrow";
  return "wide";
};

const formatAngstroms = (value: number) => `${value.toFixed(2)} A`;

export default function BandpassTuningSimulator({ copy }: BandpassTuningSimulatorProps) {
  const baseId = useId();
  const widthInputId = `${baseId}-width`;
  const offsetInputId = `${baseId}-offset`;
  const readoutId = `${baseId}-readout`;
  const descriptionId = `${baseId}-description`;
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);

  const resultLabel = useMemo(() => {
    const state = classifyBandpassState(width, offset);
    return copy.results[state];
  }, [copy.results, offset, width]);

  const windowWidth = (width / PLOT_RANGE) * 100;
  const windowCenter = 50 + (offset / PLOT_RANGE) * 100;

  const updateWidth = (event: RangeInputEvent) => {
    setWidth(Number(event.currentTarget.value));
  };

  const updateOffset = (event: RangeInputEvent) => {
    setOffset(Number(event.currentTarget.value));
  };

  return (
    <div className="instrument-panel bandpass-sim" aria-label={copy.ariaLabel} role="group">
      <div className="bandpass-sim__plot" aria-hidden="true">
        <span className="bandpass-sim__center" />
        <span
          className="bandpass-sim__window"
          style={{
            left: `${windowCenter}%`,
            width: `${windowWidth}%`,
          }}
        />
      </div>

      <div className="bandpass-sim__labels" aria-hidden="true">
        <span>{copy.centerLabel}</span>
        <span>{copy.windowLabel}</span>
      </div>

      <p className="sr-only" id={descriptionId}>
        {copy.helpText}
      </p>

      <output
        aria-live="polite"
        className="bandpass-sim__readout"
        htmlFor={`${widthInputId} ${offsetInputId}`}
        id={readoutId}
      >
        <span>
          {copy.widthReadoutLabel}: {formatAngstroms(width)}
        </span>
        <span>
          {copy.offsetReadoutLabel}: {formatAngstroms(offset)}
        </span>
        <strong>
          {copy.resultReadoutLabel}: {resultLabel}
        </strong>
      </output>

      <div className="bandpass-sim__controls">
        <label htmlFor={widthInputId}>
          <span>{copy.widthLabel}</span>
          <input
            aria-describedby={`${readoutId} ${descriptionId}`}
            id={widthInputId}
            max={MAX_WIDTH}
            min={MIN_WIDTH}
            step="0.05"
            type="range"
            value={width}
            onChange={updateWidth}
            onInput={updateWidth}
          />
        </label>

        <label htmlFor={offsetInputId}>
          <span>{copy.offsetLabel}</span>
          <input
            aria-describedby={`${readoutId} ${descriptionId}`}
            id={offsetInputId}
            max={MAX_OFFSET}
            min={MIN_OFFSET}
            step="0.05"
            type="range"
            value={offset}
            onChange={updateOffset}
            onInput={updateOffset}
          />
        </label>
      </div>
    </div>
  );
}
