'use client';

import Link from 'next/link';
import type { SpineEntry, SpineGroup } from '@/data/timeline';

type Props = {
  groups: SpineGroup[];
  selectedId: string;
  /** Provided by the interactive index; omitted on case-study pages. */
  onSelect?: (id: string) => void;
};

/**
 * The commit graph. Rails and markers are drawn in CSS rather than with
 * box-drawing characters, which depend on font metrics and read poorly to a
 * screen reader. The glyph shapes are the same: a filled dot for a node, a ring
 * for the detail lines beneath it.
 */
export default function CommitSpine({ groups, selectedId, onSelect }: Props) {
  return (
    <nav aria-label="Work and background" className="pb-6">
      {groups.map((group) => (
        <section key={group.label} className="mb-5 last:mb-0">
          <p className="mono mb-1.5 text-[11px] uppercase tracking-[0.12em] text-faint">
            {group.label}
          </p>

          <ol className="relative">
            {/* The rail, centred under the 7px node markers. */}
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-[3px] top-2 w-px bg-rule"
            />
            {group.entries.map((entry) => (
              <SpineRow
                key={entry.id}
                entry={entry}
                selected={entry.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </ol>
        </section>
      ))}
    </nav>
  );
}

function SpineRow({
  entry,
  selected,
  onSelect,
}: {
  entry: SpineEntry;
  selected: boolean;
  onSelect?: (id: string) => void;
}) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full ring-4 ring-canvas ${
          selected ? 'bg-accent' : 'bg-spine'
        }`}
      />
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
        <span
          className={`text-sm leading-snug ${selected ? 'text-accent' : 'text-ink'}`}
        >
          {entry.label}
          {/*
            The arrow lives inside the label rather than beside it, joined by a
            non-breaking space. As a sibling flex item it became its own line
            whenever a long title wrapped; this keeps it pinned to the last word.
          */}
          {entry.href && (
            <span aria-hidden="true" className="mono text-[11px] text-faint">
              &nbsp;&rarr;
            </span>
          )}
        </span>
        {entry.meta && (
          <span className="mono text-[11px] text-faint">{entry.meta}</span>
        )}
      </span>
    </>
  );

  const shared =
    'grid w-full grid-cols-[7px_minmax(0,1fr)] items-start gap-x-2.5 rounded py-1 pl-0 pr-2 text-left transition-colors';

  return (
    <li data-spine-id={entry.id}>
      {onSelect ? (
        /*
         * On the index, every row selects rather than navigates - including the
         * featured projects, which preview in the pane and offer the case study
         * as a deliberate second step. The arrow glyph marks the rows that have
         * a page behind them, and Enter is what opens it.
         */
        <button
          type="button"
          onClick={() => onSelect(entry.id)}
          aria-current={selected ? 'true' : undefined}
          className={`${shared} hover:bg-raised`}
        >
          {body}
        </button>
      ) : (
        <Link
          href={entry.href ?? '/'}
          aria-current={selected ? 'page' : undefined}
          className={`${shared} hover:bg-raised`}
        >
          {body}
        </Link>
      )}

      {entry.children && entry.children.length > 0 && (
        <ul className="mb-1">
          {entry.children.map((child) => (
            <li
              key={child}
              className="grid grid-cols-[7px_minmax(0,1fr)] items-start gap-x-2.5 pr-2"
            >
              <span
                aria-hidden="true"
                className="ml-[1px] mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full border border-spine bg-canvas"
              />
              <span className="mono text-[11px] leading-relaxed text-dim">{child}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
