'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeSwitcher = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the theme switcher once mounted on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="theme-switch-placeholder w-[50px] h-[26px] flex items-center"></div>;
  }

  return (
    <div className="theme-switch flex items-center">
      <input
        type="checkbox"
        className="checkbox"
        id="theme-toggle"
        checked={darkMode}
        onChange={toggleTheme}
      />
      <label htmlFor="theme-toggle" className="checkbox-label inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
