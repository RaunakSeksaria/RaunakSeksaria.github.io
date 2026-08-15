'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher';

export type Position = { index: number; total: number };

/**
 * The right-hand end of the bottom bar: position, resume, theme.
 *
 * Shared so the index (where the bar carries the prompt) and the case-study
 * pages (where it carries a path) cannot drift apart.
 */
export function BarActions({ position }: { position?: Position }) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-4">
      {position && (
        <span className="mono text-xs text-faint">
          [{position.index}/{position.total}]
        </span>
      )}
      <a
        id="status-resume"
        href="/Raunak_Seksaria_Resume.pdf"
        download="Raunak_Seksaria_Resume.pdf"
        className="mono inline-flex items-center gap-1.5 text-xs text-dim transition-colors hover:text-ink"
      >
        <span aria-hidden="true" className="text-accent">
          r
        </span>
        <span>resume</span>
      </a>
      <ThemeSwitcher />
    </div>
  );
}

/**
 * Fixed bottom bar for pages without a prompt.
 *
 * On the index the command line owns this slot instead, so there is only ever
 * one path indicator on screen: either this breadcrumb or the prompt's cwd,
 * never both.
 */
export default function StatusBar({
  context,
  position,
}: {
  context: string;
  position?: Position;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-canvas">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6">
        <p className="mono flex min-w-0 items-center gap-2 text-xs">
          <span aria-hidden="true" className="cursor-block" />
          <span className="truncate text-dim">{context}</span>
        </p>
        <BarActions position={position} />
      </div>
    </div>
  );
}
