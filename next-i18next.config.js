const path = require('path');

module.exports = {
  i18n: {
    localeDetection: false,
    defaultLocale: 'en',
    locales: ['en', 'de', 'cs', 'es', 'fr', 'it', 'pt-BR'],
  },
  localePath: path.resolve('./public/static/locales'),
};
