// const getConfig = require('./tenant.config');
const path = require('path');
const { initReactI18next } = require('react-i18next');

// const config = getConfig();

module.exports = {
    i18n: {
      debug: true,
      localeDetection: true,
      defaultLocale: "en",
      locales: ["en", "de", "it", "es", "fr", "pt-BR"],
      localePath: path.resolve('./public/static/locales'),
      fallbackLng: 'en',
    },
    serializeConfig: false,
    detection: {
        // check if language is cached in cookies, if not check local storage,
        // last retrieve from browser language
        order: ['cookie', 'localStorage', 'navigator'],

        // next-i18next by default searches for the 'next-i18next' cookie on server requests
        lookupCookie: 'language',
        lookupLocalStorage: 'language',

        // cache the language in cookies and local storage
        caches: ['cookie', 'localStorage'],
    },
    react: {
      // trigger a rerender when language is changed
      bindI18n: 'languageChanged',
      // we're NOT using suspense to detect when the translations have loaded
      useSuspense: false,
    },
    use: [initReactI18next]
};