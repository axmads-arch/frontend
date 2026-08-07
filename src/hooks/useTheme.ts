// src/hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rc_dark';

export function useTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  const toggleDark = useCallback(() => setDarkMode(d => !d), []);

  return { darkMode, toggleDark };
}
