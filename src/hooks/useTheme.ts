import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContext {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Provide a default implementation for standalone usage
    const [theme, setThemeState] = useState<Theme>('dark');
    
    useEffect(() => {
      const stored = localStorage.getItem('juno-theme') as Theme;
      if (stored && ['dark', 'light'].includes(stored)) {
        setThemeState(stored);
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('juno-theme', theme);
      document.documentElement.classList.toggle('light', theme === 'light');
    }, [theme]);

    return {
      theme,
      toggleTheme: () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark'),
      setTheme: setThemeState
    };
  }
  return context;
};

export { ThemeContext };