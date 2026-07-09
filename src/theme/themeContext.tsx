import type { ReactNode } from 'react';
import type { SetState } from '../features/common/types/common';

import { useEffect, useState, createContext, useContext } from 'react';
import { useTenantStore } from '../stores/tenantStore';

type Theme = 'theme-light' | 'theme-dark';

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: SetState<Theme>;
}>({
  theme: 'theme-light',
  setTheme: () => {},
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // local state
  const [theme, setTheme] = useState<Theme>('theme-light');
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  useEffect(() => {
    if (tenantConfig.config.darkModeEnabled !== true) {
      setTheme('theme-light');
      return;
    }

    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme === 'theme-light' ? 'theme-light' : 'theme-dark');
      } else {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          setTheme('theme-dark');
          localStorage.setItem('theme', 'theme-dark');
        } else {
          setTheme('theme-light');
          localStorage.setItem('theme', 'theme-light');
        }
      }
    }
  }, [tenantConfig.config.darkModeEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
