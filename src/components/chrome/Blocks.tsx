import type { Block, Finding as FindingType, Measurement } from '@/data/types';

/** `⏺ label` with a hairline rule running out to the margin. */
export function SectionHead({ label }: { label: string }) {
  return (
    <h2 className="section-head">
      <span aria-hidden="true" className="text-accent">
        &#9679;
      </span>
      <span>{label}</span>
    </h2>
  );
}

/** Dim mono tokens joined by a middot. Deliberately not tinted pill chips. */
export function StackLine({ stack }: { stack: string[] }) {
  return (
    <p className="mono text-xs text-faint">
      {stack.map((item, index) => (
        <span key={item}>
          {index > 0 && <span aria-hidden="true"> &middot; </span>}
          {item}
        </span>
      ))}
    </p>
  );
}

/**
 * A measured finding: the hypothesis going in, and what the numbers showed.
 *
 * Deliberately not styled as a red/green diff. Stating a hypothesis and then a
 * result is ordinary engineering practice, whereas +/- coding invites the reader
 * to score one line as wrong. The labels are mono so it still reads as
 * instrument output; the text is sans because these run to a few sentences and
 * mono prose at that length is work to read.
 */
export function Finding({ finding }: { finding: FindingType }) {
  return (
    <div className="overflow-hidden rounded border border-rule">
      <div className="border-b border-rule px-3.5 py-3">
        <p className="mono mb-1 text-[11px] uppercase tracking-[0.12em] text-faint">
          hypothesis
        </p>
        <p className="prose-block text-sm text-dim">{finding.suspected}</p>
      </div>
      <div className="px-3.5 py-3">
        <p className="mono mb-1 text-[11px] uppercase tracking-[0.12em] text-accent">
          what the measurement showed
        </p>
        <p className="prose-block text-sm text-ink">{finding.found}</p>
      </div>
    </div>
  );
}

/** Tabular figures, hairline rules, no zebra striping. Scrolls in its own box. */
export function MeasurementTable({ table }: { table: Measurement }) {
  const numeric = new Set(table.numeric ?? []);

  return (
    <div>
      <div className="overflow-guard">
        <table className="measure-table">
          <thead>
            <tr>
              {table.columns.map((column, index) => (
                <th key={column} scope="col" className={numeric.has(index) ? 'num' : undefined}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${table.columns[index]}`}
                    className={numeric.has(index) ? 'num' : undefined}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <p className="prose-block mt-2.5 text-xs leading-relaxed text-dim">{table.note}</p>
      )}
    </div>
  );
}

/** Renders one content block. */
export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return <p className="prose-block text-sm">{block.text}</p>;

    case 'bullets':
      return (
        <ul className="prose-block space-y-2 text-sm">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden="true" className="mono select-none text-faint">
                &#9702;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'table':
      return <MeasurementTable table={block.table} />;

    case 'finding':
      return <Finding finding={block.finding} />;

    case 'pairs':
      return (
        <div className="overflow-guard">
          <table className="measure-table">
            <tbody>
              {block.pairs.map(([term, value]) => (
                <tr key={term}>
                  <th scope="row" className="pr-6 align-top">
                    {term}
                  </th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'note':
      return (
        <p className="prose-block border-l-2 border-rule pl-3 text-xs leading-relaxed text-dim">
          {block.text}
        </p>
      );
  }
}

/** A run of blocks with consistent vertical rhythm. */
export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockView key={`${block.kind}-${index}`} block={block} />
      ))}
    </div>
  );
}
