'use client';

import { useEffect } from 'react';
import type { SpineEntry } from '@/data/timeline';

type Options = {
  order: SpineEntry[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Enter on a row that has a page behind it. */
  onOpen: () => void;
  onToggleTheme: () => void;
};

/** True when the user is typing, so shortcuts must not fire. */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

/**
 * Keyboard navigation, layered over controls that already work by click and tap.
 *
 * Arrow keys are deliberately left alone so the page still scrolls normally,
 * and every binding here is one the status bar actually advertises.
 */
export function useSpineKeys({
  order,
  selectedId,
  onSelect,
  onOpen,
  onToggleTheme,
}: Options) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;

      const current = order.findIndex((entry) => entry.id === selectedId);
      if (current === -1) return;

      switch (event.key) {
        case 'j':
          event.preventDefault();
          onSelect(order[Math.min(current + 1, order.length - 1)].id);
          break;
        case 'k':
          event.preventDefault();
          onSelect(order[Math.max(current - 1, 0)].id);
          break;
        case 'g':
          event.preventDefault();
          onSelect(order[0].id);
          break;
        case 'G':
          event.preventDefault();
          onSelect(order[order.length - 1].id);
          break;
        case 'Enter':
          onOpen();
          break;
        case 't':
          event.preventDefault();
          onToggleTheme();
          break;
        case 'r':
          event.preventDefault();
          document.getElementById('status-resume')?.click();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, selectedId, onSelect, onOpen, onToggleTheme]);
}
