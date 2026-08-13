'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher';

type Props = {
  /** Path-like label for where you are, e.g. `~/work/bytecode-engine`. */
  context: string;
  position?: { index: number; total: number };
  /** Only the interactive index shows key hints; the case-study pages do not. */
  showKeyHints?: boolean;
};

/**
 * Fixed bottom bar. globals.css sets scroll-padding-bottom so anchored content
 * never lands underneath it, and every page reserves matching bottom padding.
 */
export default function StatusBar({ context, position, showKeyHints = false }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-canvas">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6">
        <p className="mono flex min-w-0 items-center gap-2 text-xs">
          <span aria-hidden="true" className="cursor-block" />
          <span className="truncate text-dim">{context}</span>
        </p>

        {showKeyHints && (
          <p
            aria-hidden="true"
            className="mono hidden items-center gap-4 text-xs text-faint lg:flex"
          >
            <span>
              <span className="text-accent">j</span>
              <span className="text-rule">/</span>
              <span className="text-accent">k</span> move
            </span>
            <span>
              <span className="text-accent">enter</span> open
            </span>
          </p>
        )}

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
      </div>
    </div>
  );
}
