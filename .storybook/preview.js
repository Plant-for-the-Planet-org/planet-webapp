import '../src/theme/global.scss';
import './storybook.scss';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import muiThemeNew from '../src/theme/muiThemeNew';
import { ThemeProvider } from '@storybook/theming';
// import { ThemeProvider } from 'emotion-theming';

/*
 * Global decorator to apply the styles to all stories
 * Read more about them at:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */
export const decorators = [
  (Story) => (
    <MUIThemeProvider theme={muiThemeNew}>
      <ThemeProvider theme={muiThemeNew}>
        <Story />
      </ThemeProvider>
    </MUIThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
