import { createTheme } from '@mui/material';

import theme from './themeProperties';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    base?: string;
  }
}

const materialTheme = createTheme({
  palette: {
    primary: {
      main: theme.primaryColor,
      contrastText: theme.light.light,
      light: theme.light.tabBackgroundColor,
    },
    background: {
      base: theme.light.backgroundBase,
      default: theme.light.light,
    },
    error: {
      main: theme.light.dangerColor,
    },
    text: {
      primary: theme.light.primaryFontColor,
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: theme.fontSizes.fontRemLarge,
    },
    h2: {
      fontSize: theme.fontSizes.fontRemMedium,
      fontWeight: theme.fontWeight,
    },
    button: {
      fontSize: theme.fontSizes.fontRemSmall,
      lineHeight: 1.3333,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: theme.fontSizes.fontRemXSmall,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'none',
          padding: '12px 30px',
        },
        containedSizeSmall: {
          padding: '5px 10px',
          borderRadius: 14,
        },
        text: {
          padding: 0,
          borderRadius: 0,
          fontSize: 'inherit',
          fontWeight: theme.fontWeight,
        },
        textWarning: {
          color: theme.light.dangerColor,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 30,
          fontSize: theme.fontSizes.fontRemXSmall,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: '0.875rem',
        },
      },
    },
  },
});

export default materialTheme;
