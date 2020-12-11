const NextI18Next = require('next-i18next').default;
const { initReactI18next } = require('react-i18next');
const path = require('path');

module.exports = new NextI18Next({
  use: [initReactI18next],
  defaultLanguage: 'en',
  fallbackLng: 'en',
  otherLanguages: ['de', 'es', 'fr', 'it', 'pt-BR'],
  localePath: path.resolve('./public/static/locales'),
});
