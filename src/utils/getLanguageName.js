import supportedLanguages from './supportedLanguages.json';

/**
 * * Returns country details by searching country data json file and options
 * @param {String} code - language Code
 *
 * @returns {String} language name
 */
// @ankit please check this function always
// eslint-disable-next-line consistent-return
export default function getLanguageName(code) {
  // Finds required language name from the code
  for (let i = 0; i < supportedLanguages.length; i++) {
    console.log(supportedLanguages, code);
    if (supportedLanguages[i].langCode === code) {
      return supportedLanguages[i].languageName;
    }
  }
  // returns English as default language if none matches
  return 'English';
}
