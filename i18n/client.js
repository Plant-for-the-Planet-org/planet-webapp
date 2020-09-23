import LanguageDetector from 'i18next-browser-languagedetector';
import NextI18Next from 'next-i18next';
import { initReactI18next } from 'react-i18next';

export default new NextI18Next({
  use: [LanguageDetector, initReactI18next],
  defaultLanguage: 'en',
  fallbackLng: 'en',
  debug: false,
  otherLanguages: ['de'], // list all languages here
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
});
