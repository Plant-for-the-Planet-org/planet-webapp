const path = require('path');
// import getConfig from './tenant.config';
// import LanguageDetector from 'i18next-browser-languagedetector';

// const config = getConfig();

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'fr', 'it', 'pt-Br'],
  },
  fallBackLang: 'en',
  localePath: path.resolve('./public/static/locales'),
  serializeConfig: false,
  debug: false,
  // use: [LanguageDetector],
  // detection: {
  //   //order and from where user language should be detected
  //   order: ['cookie', 'localStorage', 'navigator'],
  // },
  // //keys or params to lookup language from
  // lookupCookie: 'language',
  // lookupLocalStorage: 'language',

  // // cache user language on
  // caches: ['cookie', 'localStorage'],
};
