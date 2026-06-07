import { useState } from "react";

type Labels = { beforeLabel: string; afterLabel: string; instruction: string };

export function BeforeAfter({ labels }: { labels: Labels }) {
  const [value, setValue] = useState(50);

  return (
    <div className="before-after instrument-panel">
      <div className="before-after__stage">
        {/* "After" layer: the real H-alpha image */}
        <img
          className="before-after__img"
          src="/images/sun-h-alpha.png"
          alt=""
        />
        {/* "Before" layer: same image with white-light simulation filter, clipped by slider */}
        <div
          className="before-after__before"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <img
            className="before-after__img before-after__img--bw"
            src="/images/sun-h-alpha.png"
            alt=""
          />
          <span className="before-after__tag before-after__tag--before">
            {labels.beforeLabel}
          </span>
        </div>
        {/* "After" label always visible on the right */}
        <span className="before-after__tag before-after__tag--after">
          {labels.afterLabel}
        </span>
        {/* Drag handle line */}
        <span
          className="before-after__handle"
          style={{ left: `${value}%` }}
          aria-hidden="true"
        />
      </div>
      <input
        className="before-after__range"
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label={labels.instruction}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}
