import { useState } from "react";

type Method = {
  id: string;
  name: string;
  where: string;
  passes: string;
  layer: string;
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
      <p className="filter-comparison__field-value">{value}</p>
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
          {/* Visual layer preview */}
          <div
            className={`filter-comparison__preview filter-comparison__preview--${method.id}`}
            aria-hidden="true"
          />

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
