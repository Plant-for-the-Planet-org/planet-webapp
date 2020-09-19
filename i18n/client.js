import LanguageDetector from 'i18next-browser-languagedetector';
import NextI18Next from 'next-i18next';
import { initReactI18next } from 'react-i18next';

export default new NextI18Next({
  use: [LanguageDetector, initReactI18next],
  defaultLanguage: 'en',
  fallbackLng: 'en',
  otherLanguages: ['de', 'es'], // list all languages here
  detection: {
    // check if language is cached in cookies, if not check local storage
    order: ['cookie', 'localStorage'],

    // next-i18next by default searches for the 'next-i18next' cookie on server requests
    lookupCookie: 'next-i18next',
    lookupLocalStorage: 'i18nextLng',

    // cache the language in cookies and local storage
    caches: ['cookie', 'localStorage'],
  },
  react: {
    // trigger a rerender when language is changed
    bindI18n: 'languageChanged',
    // we're NOT using suspsense to detect when the translations have loaded
    useSuspense: false,
  },
});
