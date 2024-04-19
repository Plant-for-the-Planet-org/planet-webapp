// i18n config for next-intl
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'cs', 'es', 'fr', 'it', 'pt-BR'],
};

export type Locale = (typeof i18nConfig)['locales'][number];
