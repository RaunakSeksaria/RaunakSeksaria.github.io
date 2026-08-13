'use client';

import { useTheme } from '@/context/ThemeContext';

/**
 * Rendered as a status-bar control: a dim accent key hint plus the theme the
 * press would switch *to*, so the label reads as an action rather than a state.
 *
 * Before hydration the label is neutral ("theme"), because the real value lives
 * in a class the blocking script set and the server cannot know it.
 */
export default function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { darkMode, toggleTheme, mounted } = useTheme();
  const destination = darkMode ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? `Switch to ${destination} theme` : 'Switch theme'}
      className={`mono inline-flex items-center gap-1.5 text-xs text-dim transition-colors hover:text-ink ${className}`}
    >
      <span aria-hidden="true" className="text-accent">
        t
      </span>
      <span>{mounted ? destination : 'theme'}</span>
    </button>
  );
}
