import { createTheme } from '@mui/material';

// Adding custom variables to theme using module augmentation
declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    base?: string;
  }
}

const muiThemeNew = createTheme({
  palette: {
    primary: {
      main: '#68b030',
      light: '#f4ffec',
      contrastText: '#fff',
    },
    error: {
      main: '#e74c3c',
    },
    background: {
      base: '#fafaff',
      default: '#fff',
    },
    text: {
      primary: '#2f3336',
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
      fontSize: '2.25rem',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    button: {
      fontSize: '1.125rem',
      lineHeight: 1.3333,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 30,
          fontSize: '0.875rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'capitalize',
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
          fontWeight: 700,
        },
        textWarning: {
          color: '#e74c3c',
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
  },
});

export default muiThemeNew;
