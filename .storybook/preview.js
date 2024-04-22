import '../src/theme/global.scss';
import './storybook.scss';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import materialTheme from '../src/theme/themeStyles';
import { ThemeProvider } from '@storybook/theming';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { lazy, useEffect } from 'react';
import { useTheme } from '../src/theme/themeContext';

// import { ThemeProvider } from 'emotion-theming';

/*
 * Global decorator to apply the styles to all stories
 * Read more about them at:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */

const globalStyles = lazy(() => import('../src/theme/theme'));

export const decorators = [
  (Story, context) => {
    const { locale } = context.globals;
    const { theme: themeType } = useTheme();

    useEffect(() => {
      i18n.changeLanguage(locale);
    }, [locale]);

    return (
      <I18nextProvider i18n={i18n}>
        <style>{globalStyles}</style>
        <div className={`${themeType}`}>
          <MUIThemeProvider theme={materialTheme}>
            <ThemeProvider theme={materialTheme}>
              <Story />
            </ThemeProvider>
          </MUIThemeProvider>
        </div>
      </I18nextProvider>
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
