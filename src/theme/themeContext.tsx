// const initialValue = { theme: "theme-light" };
import React from 'react';

export const ThemeContext = React.createContext({
  theme: 'string',
  toggleTheme: () => {},
});

export default function ThemeProvider({ children }:any) {
  const [theme, setTheme] = React.useState('theme-light');

  const toggleTheme = () => {
    setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light');
  };
React.useEffect(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme("theme-dark")
}
}, [])
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
