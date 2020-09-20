/* eslint-disable camelcase */
import de from './de';
import en from './en';
import es from './es';

let language = 'en';
let localLanguage;
if (typeof Storage !== 'undefined') {
  localLanguage = localStorage.getItem('language');
}
if (localLanguage) {
  language = localLanguage;
}

export default function getTranslation() {
  switch (language) {
    case 'de':
      return de;
    case 'es':
      return es;
    case 'en':
      return en;
    default:
      return en;
  }
}
