import path from 'path';
import LanguageDetector from 'i18next-browser-languagedetector';
import NextI18Next from 'next-i18next';
import { initReactI18next } from 'react-i18next';
import getConfig from '../tenant.config';

const config = getConfig();
let firstDay = new Date()
export default new NextI18Next({
  use: [LanguageDetector, initReactI18next],
  localePath: path.resolve('./public/static/locales'),
  defaultLanguage: config.languages[0] ? config.languages[0] : 'en',
  fallbackLng: config.languages[0] ? config.languages[0] : 'en',
  debug: false,
  otherLanguages: config.languages, // list all languages here
  detection: {
    // check if language is cached in cookies, if not check local storage,
    // last retrieve from browser language
    order: ['cookie', 'localStorage', 'navigator'],

    // next-i18next by default searches for the 'next-i18next' cookie on server requests
    lookupCookie: 'language',
    lookupLocalStorage: 'language',

    // cache the language in cookies and local storage
    caches: ['cookie', 'localStorage'],
    cookieSameSite: 'none',
    cookieSecure: true,
    cookieExpirationDate: new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000),
  },
  react: {
    // trigger a rerender when language is changed
    bindI18n: 'languageChanged',
    // we're NOT using suspsense to detect when the translations have loaded
    useSuspense: false,
  },
});
