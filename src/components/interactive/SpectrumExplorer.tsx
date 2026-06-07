import { type ChangeEvent, useId, useMemo, useState } from "react";

type SpectrumExplorerCopy = {
  ariaLabel: string;
  label: string;
  body: string;
  lineLabel: string;
  markerDescription: string;
  controlLabel: string;
  selectedLabel: string;
};

type SpectrumExplorerProps = {
  copy: SpectrumExplorerCopy;
};

const MIN_WAVELENGTH = 400;
const MAX_WAVELENGTH = 700;
const H_ALPHA_WAVELENGTH = 656.28;

const getPosition = (wavelength: number) =>
  ((wavelength - MIN_WAVELENGTH) / (MAX_WAVELENGTH - MIN_WAVELENGTH)) * 100;

export default function SpectrumExplorer({ copy }: SpectrumExplorerProps) {
  const baseId = useId();
  const inputId = `${baseId}-wavelength`;
  const readoutId = `${baseId}-readout`;
  const markerDescriptionId = `${baseId}-marker-description`;
  const [selectedWavelength, setSelectedWavelength] = useState(H_ALPHA_WAVELENGTH);
  const selectedPosition = useMemo(() => getPosition(selectedWavelength), [selectedWavelength]);
  const hAlphaPosition = getPosition(H_ALPHA_WAVELENGTH);
  const updateSelectedWavelength = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedWavelength(Number(event.currentTarget.value));
  };

  return (
    <div className="instrument-panel spectrum-explorer" aria-label={copy.ariaLabel} role="group">
      <div className="spectrum-explorer__header">
        <div>
          <p className="spectrum-explorer__label">{copy.label}</p>
          <p>{copy.body}</p>
        </div>
        <output
          aria-live="polite"
          className="spectrum-explorer__readout"
          htmlFor={inputId}
          id={readoutId}
        >
          {copy.selectedLabel}: {selectedWavelength.toFixed(0)} nm
        </output>
      </div>

      <div className="spectrum-explorer__bar" aria-hidden="true">
        <span
          className="spectrum-explorer__line spectrum-explorer__line--halpha"
          style={{ left: `${hAlphaPosition}%` }}
        />
        <span
          className="spectrum-explorer__line spectrum-explorer__line--selected"
          style={{ left: `${selectedPosition}%` }}
        />
      </div>

      <div className="spectrum-explorer__scale" aria-hidden="true">
        <span>400 nm</span>
        <span>{copy.lineLabel}</span>
        <span>700 nm</span>
      </div>

      <p className="sr-only" id={markerDescriptionId}>
        {copy.markerDescription}
      </p>

      <label className="spectrum-explorer__control" htmlFor={inputId}>
        <span>{copy.controlLabel}</span>
        <input
          aria-describedby={`${readoutId} ${markerDescriptionId}`}
          id={inputId}
          max={MAX_WAVELENGTH}
          min={MIN_WAVELENGTH}
          step="1"
          type="range"
          value={Math.round(selectedWavelength)}
          onChange={updateSelectedWavelength}
        />
      </label>
    </div>
  );
}
