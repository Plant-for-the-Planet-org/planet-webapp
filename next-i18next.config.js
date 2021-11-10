// const getConfig = require('./tenant.config');
const path = require('path');
const LanguageDetector = require('i18next-browser-languagedetector');
const { initReactI18next } = require('react-i18next');

// const config = getConfig();

module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },
    localePath: path.resolve('./public/static/locales'),
    fallbackLng: 'en',
    debug: false,
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
        // we're NOT using suspsense to detect when the translations have loaded
        useSuspense: false,
      },
    // use: [initReactI18next,LanguageDetector]
  };