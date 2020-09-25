const NextI18Next = require('next-i18next').default;
const path = require('path');
const getConfig = require('../tenant.config');

const config = getConfig();

module.exports = new NextI18Next({
  defaultLanguage: config.languages[0] ? config.languages[0] : 'en',
  fallbackLng: config.languages[0] ? config.languages[0] : 'en',
  otherLanguages: config.languages.splice(0, 1),
  localePath: path.resolve('./public/static/locales'),
});
