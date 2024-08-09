import React, { ReactNode } from 'react';
import { useTenant } from '../features/common/Layout/TenantContext';

export const ThemeContext = React.createContext({
  theme: 'theme-light',
  setTheme: (theme: any) => theme,
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = React.useState('theme-light');
  const { tenantConfig } = useTenant();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && tenantConfig.config.darkModeEnabled) {
      if (localStorage.getItem('theme')) {
        if (localStorage.getItem('theme') === 'theme-light') {
          setTheme('theme-light');
        } else {
          setTheme('theme-dark');
        }
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
  }, []);

  React.useEffect(() => {
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
  return React.useContext(ThemeContext);
}
