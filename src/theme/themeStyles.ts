import { createTheme } from '@mui/material';

import themeProperties from './themeProperties';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    base?: string;
  }
}

const materialTheme = createTheme({
  palette: {
    primary: {
      main: themeProperties.primaryColor,
      contrastText: themeProperties.light.light,
      light: themeProperties.light.tabBackgroundColor,
    },
    background: {
      base: themeProperties.light.backgroundBase,
      default: themeProperties.light.light,
    },
    error: {
      main: themeProperties.light.dangerColor,
    },
    text: {
      primary: themeProperties.light.primaryFontColor,
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
      fontSize: themeProperties.fontSizes.fontXXLarge,
    },
    h2: {
      fontSize: themeProperties.fontSizes.fontLarge,
      fontWeight: themeProperties.fontWeight,
    },
    button: {
      fontSize: themeProperties.fontSizes.fontMedium,
      lineHeight: 1.3333,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: themeProperties.fontSizes.fontSmall,
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
          fontWeight: themeProperties.fontWeight,
        },
        textWarning: {
          color: themeProperties.light.dangerColor,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 30,
          fontSize: themeProperties.fontSizes.fontSmall,
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
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: '3px 6px 0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          verticalAlign: 'top',
        },
        root: {
          padding: '6px',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: themeProperties.fontSizes.fontSmall,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        inputSizeSmall: {
          padding: '8.5px',
        },
        multiline: ({ ownerState }) => ({
          ...(ownerState.size === 'small' && {
            padding: 0,
          }),
        }),
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: `${themeProperties.fontSizes.fontSixteen} !important`,
        },
      },
    },
  },
});

export default materialTheme;
