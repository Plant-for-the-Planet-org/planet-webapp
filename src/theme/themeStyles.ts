import { createTheme } from '@mui/material';

import theme from './themeProperties';

const materialTheme = createTheme({
  palette: {
    primary: {
      main: theme.primaryColor,
    },
  },
});

export default materialTheme;
