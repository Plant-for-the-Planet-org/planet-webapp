import supportedLanguages from './supportedLanguages.json';
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de"
import esLocale from "date-fns/locale/es";
import frLocale from "date-fns/locale/fr"
import itLocale from "date-fns/locale/it";
import ptBRLocale from "date-fns/locale/pt-BR"
/**
 * * Returns country details by searching country data json file and options
 * @param {String} code - language Code
 *
 * @returns {String} language name
 */
// @ankit please check this function always
// eslint-disable-next-line consistent-return
export default function getLanguageName(code: any) {
  // Finds required language name from the code
  for (let i = 0; i < supportedLanguages.length; i++) {
    if (supportedLanguages[i].langCode === code) {
      return supportedLanguages[i].languageName;
    }
  }
  // returns English as default language if none matches
  return 'English';
}

export const localeMapForDate = {
  en: enLocale,
  de: deLocale,
  es: esLocale,
  fr: frLocale,
  it: itLocale,
  'pt-BR': ptBRLocale,
};