import { createTheme } from 'mui-latest';

// Adding custom variables to theme using module augmentation
declare module 'mui-latest/styles/createPalette' {
  interface TypeBackground {
    base?: string;
  }
}

const muiThemeNew = createTheme({
  palette: {
    primary: {
      main: '#68b030',
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
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 30,
        },
      },
    },
  },
});

export default muiThemeNew;
