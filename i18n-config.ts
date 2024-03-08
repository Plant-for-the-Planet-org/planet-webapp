export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'cs', 'es', 'fr', 'it', 'pt-BR'],
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];
