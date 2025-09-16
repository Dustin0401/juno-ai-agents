import React, { useState, useEffect } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { safeGetItem, safeSetItem } from '@/lib/storage';

type Theme = 'dark' | 'light';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const stored = safeGetItem('juno-theme') as Theme;
    if (stored && ['dark', 'light'].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    safeSetItem('juno-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};