import '../src/theme/global.scss';
import './storybook.scss';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import materialTheme from '../src/theme/themeStyles';
import { ThemeProvider } from '@storybook/theming';
import { lazy } from 'react';
import { useTheme } from '../src/theme/themeContext';
import getMessages from './i18n';
import { NextIntlClientProvider } from 'next-intl';

const globalStyles = lazy(() => import('../src/theme/theme'));

/*
 * Global decorator to apply the styles to all stories
 * Read more about them at:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */
export const decorators = [
  (Story, context) => {
    const locale = context.globals.locale;
    const { theme: themeType } = useTheme();

    return (
      <NextIntlClientProvider messages={getMessages(locale)} locale={locale}>
        <style>{globalStyles}</style>
        <div
          className={`${themeType}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <MUIThemeProvider theme={materialTheme}>
            <ThemeProvider theme={materialTheme}>
              <Story />
            </ThemeProvider>
          </MUIThemeProvider>
        </div>
      </NextIntlClientProvider>
    );
  },
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

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'de', title: 'Deutsch' },
      ],
      showName: true,
    },
  },
};
