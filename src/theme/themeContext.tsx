import React from 'react';
import tenantConfig from '../../tenant.config';

export const ThemeContext = React.createContext({
  theme: 'theme-light',
  setTheme: (theme: any) => theme,
});

export default function ThemeProvider({ children }: any) {
  const [theme, setTheme] = React.useState('theme-light');
  const config = tenantConfig();
  React.useEffect(() => {
    if (typeof window !== 'undefined' && config.darkModeEnabled) {
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
