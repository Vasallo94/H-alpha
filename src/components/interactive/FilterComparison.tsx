type FilterCard = {
  title: string;
  tag: string;
  body: string;
};

type FilterComparisonProps = {
  ariaLabel: string;
  cards: FilterCard[];
};

export default function FilterComparison({ ariaLabel, cards }: FilterComparisonProps) {
  return (
    <div className="filter-comparison" aria-label={ariaLabel} role="list">
      {cards.map((card) => (
        <article className="filter-comparison__card instrument-panel" key={card.title} role="listitem">
          <p className="filter-comparison__tag">{card.tag}</p>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </article>
      ))}
    </div>
  );
}
