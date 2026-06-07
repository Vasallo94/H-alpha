import { useState } from "react";
import { renderInlineMath } from "../../lib/math";

type Method = {
  id: string;
  name: string;
  where: string;
  passes: string;
  layer: string;
  image: string;
  imageAlt: string;
  attribution: string;
  sourceUrl: string;
};

type Labels = {
  aria: string;
  fieldWhere: string;
  fieldPasses: string;
  fieldLayer: string;
  methods: Method[];
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="filter-comparison__field">
      <span className="filter-comparison__field-label">{label}</span>
      <p
        className="filter-comparison__field-value"
        dangerouslySetInnerHTML={{ __html: renderInlineMath(value) }}
      />
    </div>
  );
}

export function FilterComparison({ labels }: { labels: Labels }) {
  const [selected, setSelected] = useState<string>(labels.methods[0]?.id ?? "");

  const method = labels.methods.find((m) => m.id === selected) ?? labels.methods[0];

  return (
    <div
      className="filter-comparison instrument-panel"
      role="group"
      aria-label={labels.aria}
    >
      {/* Tab-style selector */}
      <div role="tablist" aria-label={labels.aria} className="filter-comparison__tabs">
        {labels.methods.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            id={`fc-tab-${m.id}`}
            aria-controls={`fc-panel-${m.id}`}
            aria-selected={m.id === selected}
            className="filter-comparison__tab-btn"
            aria-pressed={m.id === selected}
            onClick={() => setSelected(m.id)}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {method && (
        <div
          role="tabpanel"
          id={`fc-panel-${method.id}`}
          aria-labelledby={`fc-tab-${method.id}`}
          className="filter-comparison__panel"
        >
          <figure className="filter-comparison__photo">
            <img src={method.image} alt={method.imageAlt} loading="lazy" decoding="async" />
            <figcaption>
              <a href={method.sourceUrl} target="_blank" rel="noreferrer">
                {method.attribution}
              </a>
            </figcaption>
          </figure>

          <div className="filter-comparison__grid">
            <Field label={labels.fieldWhere} value={method.where} />
            <Field label={labels.fieldPasses} value={method.passes} />
            <Field label={labels.fieldLayer} value={method.layer} />
          </div>
        </div>
      )}
    </div>
  );
}
