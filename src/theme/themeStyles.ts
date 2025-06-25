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
      main: themeProperties.designSystem.colors.primaryColor,
      contrastText: themeProperties.designSystem.colors.white,
      light: themeProperties.designSystem.colors.softGreen,
    },
    background: {
      base: themeProperties.designSystem.colors.backgroundBase,
      default: themeProperties.designSystem.colors.white,
    },
    error: {
      main: themeProperties.designSystem.colors.fireRed,
    },
    text: {
      primary: themeProperties.designSystem.colors.coreText,
      secondary: themeProperties.designSystem.colors.softText,
    },
    success: {
      main: themeProperties.designSystem.colors.primaryColor,
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
          '&.Mui-disabled': {
            backgroundColor:
              themeProperties.designSystem.colors.mediumGreyTransparent30,
            color: themeProperties.designSystem.colors.mediumGrey,
          },
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
          color: themeProperties.designSystem.colors.fireRed,
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
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: themeProperties.designSystem.colors.mediumGrey,
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: themeProperties.designSystem.colors.mediumGrey,
            },
          },
        },
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
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: themeProperties.designSystem.colors.brightGreen,
        },
        filledInfo: {
          backgroundColor: themeProperties.designSystem.colors.oceanBlue,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: themeProperties.designSystem.colors.hintText,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& .MuiInputBase-input': {
              color: themeProperties.designSystem.colors.hintText,
              WebkitTextFillColor: themeProperties.designSystem.colors.hintText,
            },
          },
        },
      },
    },
  },
});

export default materialTheme;
