import { createTheme } from '@mui/material';

import theme from './themeProperties';

const materialTheme = createTheme({
  palette: {
    primary: {
      main: theme.primaryColor,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
        },
      },
    },
  },
});

export default materialTheme;
