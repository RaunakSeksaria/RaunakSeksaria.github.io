'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { complete, formatCwd, run, type Cwd, type Line } from '@/lib/shell';
import { BarActions, type Position } from './StatusBar';

type Props = {
  /**
   * Selecting a spine entry is owned by Browser; the shell just asks. Absent on
   * a case-study page, where there is no spine to drive - there `cat` navigates
   * back to the index anchored on that entry instead.
   */
  onSelect?: (id: string) => void;
  position?: Position;
  /** Case-study pages start you in ~/work, since that is where you are. */
  initialCwd?: Cwd;
};

/**
 * A real prompt, not a decorative one.
 *
 * Nothing here is the only route to any content: every command has a mouse
 * equivalent that already exists in the spine, so the page stays complete for
 * someone who never types, and stays static HTML for a crawler.
 */
export default function CommandLine({ onSelect, position, initialCwd = [] }: Props) {
  const [cwd, setCwd] = useState<Cwd>(initialCwd);
  const [value, setValue] = useState('');
  const [output, setOutput] = useState<Line[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toggleTheme } = useTheme();

  // A terminal that does not follow its own output is not a terminal.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [output]);

  const submit = useCallback(
    (raw: string) => {
      const result = run(raw, cwd);

      // formatCwd is the display form; store the segments it implies.
      const segments = result.cwd === '~' ? [] : result.cwd.replace(/^~\//, '').split('/');
      setCwd(segments);

      switch (result.effect.type) {
        case 'select':
          if (onSelect) onSelect(result.effect.id);
          else router.push(`/#${result.effect.id}`);
          break;
        case 'navigate':
          router.push(result.effect.href);
          break;
        case 'theme':
          toggleTheme();
          break;
        case 'resume':
          document.getElementById('status-resume')?.click();
          break;
        case 'clear':
          setOutput([]);
          return;
        default:
          break;
      }

      setOutput((previous) =>
        [
          ...previous,
          { text: `${formatCwd(cwd)} $ ${raw}`, tone: 'dim' as const },
          ...result.lines,
        ].slice(-80),
      );
    },
    [cwd, onSelect, router, toggleTheme],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Spine shortcuts must never fire while the prompt has focus.
    event.stopPropagation();

    if (event.key === 'Enter') {
      const raw = value;
      if (raw.trim()) setHistory((previous) => [...previous, raw]);
      setHistoryIndex(null);
      setValue('');
      submit(raw);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const { value: completed, candidates } = complete(value, cwd);
      setValue(completed);
      if (candidates.length > 1) {
        setOutput((previous) =>
          [...previous, { text: candidates.join('   '), tone: 'dim' as const }].slice(-80),
        );
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
      return;
    }

    if (event.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  const toneClass = (tone?: Line['tone']) =>
    tone === 'error' ? 'text-del' : tone === 'accent' ? 'text-accent' : tone === 'dim' ? 'text-faint' : 'text-dim';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-canvas">
      {output.length > 0 && (
        <div className="mx-auto max-w-6xl border-b border-rule px-4 sm:px-6">
          <div
            ref={logRef}
            className="pane-scroll max-h-[38vh] overflow-y-auto py-2"
            role="log"
            aria-label="Command output"
            aria-live="polite"
          >
            {output.map((line, index) => (
              <p
                key={`${line.text}-${index}`}
                className={`mono whitespace-pre-wrap text-xs leading-relaxed ${toneClass(line.tone)}`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}

      <form
        className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 sm:px-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="prompt" className="mono shrink-0 text-xs text-dim">
          {formatCwd(cwd)} <span className="text-accent">$</span>
        </label>
        <input
          ref={inputRef}
          id="prompt"
          name="prompt"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="try: ls"
          aria-describedby="prompt-hint"
          className="mono min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-faint"
        />
        <span id="prompt-hint" className="sr-only">
          Type help for the list of commands. Everything here is also reachable by
          clicking the list on the left.
        </span>
        <BarActions position={position} />
      </form>
    </div>
  );
}
