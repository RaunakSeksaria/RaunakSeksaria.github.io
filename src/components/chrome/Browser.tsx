'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { spine, spineOrder } from '@/data/timeline';
import CommandLine from './CommandLine';
import CommitSpine from './CommitSpine';
import DiffPane from './DiffPane';
import IdentityBar from './IdentityBar';
import { useSpineKeys } from './useSpineKeys';

const DESKTOP = '(min-width: 1024px)';

/**
 * The index, as a two-pane history browser.
 *
 * Every pane is rendered into the document exactly once. Above the lg
 * breakpoint all but the selected one is hidden, giving the two-pane behaviour;
 * below it they all stay visible and the spine becomes a jump list, so a phone
 * gets one honest scroll of everything instead of a selector to poke at.
 */
export default function Browser() {
  const [selectedId, setSelectedId] = useState(spineOrder[0].id);
  const router = useRouter();
  const { toggleTheme } = useTheme();

  const selectedIndex = Math.max(
    0,
    spineOrder.findIndex((entry) => entry.id === selectedId),
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    if (!window.matchMedia(DESKTOP).matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(id)?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, []);

  const handleOpen = useCallback(() => {
    const href = spineOrder.find((entry) => entry.id === selectedId)?.href;
    if (href) router.push(href);
  }, [router, selectedId]);

  useSpineKeys({
    order: spineOrder,
    selectedId,
    onSelect: handleSelect,
    onOpen: handleOpen,
    onToggleTheme: toggleTheme,
  });

  // Keep the selected row visible while moving through the spine by keyboard.
  useEffect(() => {
    if (!window.matchMedia(DESKTOP).matches) return;
    document
      .querySelector(`[data-spine-id="${selectedId}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedId]);

  return (
    <>
      <IdentityBar />

      <div className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-10">
          <div className="pane-scroll border-b border-rule py-5 lg:sticky lg:top-[49px] lg:h-[calc(100vh-10rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:pr-6">
            <CommitSpine groups={spine} selectedId={selectedId} onSelect={handleSelect} />
          </div>

          <main className="lg:py-6">
            {spineOrder.map((entry) => (
              <section
                key={entry.id}
                id={entry.id}
                aria-label={entry.label}
                className={`scroll-mt-16 border-b border-rule py-8 last:border-0 lg:border-0 lg:py-0 ${
                  entry.id === selectedId ? 'lg:block' : 'lg:hidden'
                }`}
              >
                <DiffPane view={entry.content} />
              </section>
            ))}
          </main>
        </div>
      </div>

      {/*
        The command line is the bottom bar here. There is deliberately no second
        status row: the prompt already shows where you are, and two competing
        path indicators stacked on each other read as a conflict.
      */}
      <CommandLine
        onSelect={handleSelect}
        position={{ index: selectedIndex + 1, total: spineOrder.length }}
      />
    </>
  );
}
