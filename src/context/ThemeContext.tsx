'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  /** False until the client has hydrated; controls render themselves neutrally. */
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleTheme: () => {},
  mounted: false,
});

export const useTheme = () => useContext(ThemeContext);

/**
 * The blocking script in layout.tsx has already put the correct class on <html>
 * before first paint, so this provider's only job is to read that decision back
 * and own the toggle. It deliberately does not choose the initial theme itself -
 * doing that here is what causes a flash.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark-mode'));
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((previous) => {
      const next = !previous;
      document.documentElement.classList.toggle('dark-mode', next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        // Storage can be unavailable in private mode; the toggle still works.
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ darkMode, toggleTheme, mounted }),
    [darkMode, toggleTheme, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
