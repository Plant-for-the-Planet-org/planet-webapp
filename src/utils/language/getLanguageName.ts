import type Locale from '@date-io/date-fns';

import supportedLanguages from './supportedLanguages.json';
import enLocale from 'date-fns/locale/en-US';
import deLocale from 'date-fns/locale/de';
import csLocale from 'date-fns/locale/cs';
import esLocale from 'date-fns/locale/es';
import frLocale from 'date-fns/locale/fr';
import itLocale from 'date-fns/locale/it';
import ptBRLocale from 'date-fns/locale/pt-BR';

/**
 * * Returns country details by searching country data json file and options
 * @param {String} code - language Code
 *
 * @returns {String} language name
 */
// @ankit please check this function always
// eslint-disable-next-line consistent-return
export default function getLanguageName(code: string) {
  // Finds required language name from the code
  for (let i = 0; i < supportedLanguages.length; i++) {
    if (supportedLanguages[i].langCode === code) {
      return supportedLanguages[i].languageName;
    }
  }
  // returns English as default language if none matches
  return 'English';
}

type LocaleMap = {
  [key: string]: Locale['locale'];
  en: Locale['locale'];
  de: Locale['locale'];
  cs: Locale['locale'];
  es: Locale['locale'];
  fr: Locale['locale'];
  it: Locale['locale'];
  'pt-BR': Locale['locale'];
};

export const localeMapForDate: LocaleMap = {
  en: enLocale,
  de: deLocale,
  cs: csLocale,
  es: esLocale,
  fr: frLocale,
  it: itLocale,
  'pt-BR': ptBRLocale,
};
