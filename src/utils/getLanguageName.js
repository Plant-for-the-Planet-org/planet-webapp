import supportedLanguages from './supportedLanguages.json';

/**
 * * Returns country details by searching country data json file and options
 * @param {String} code - language Code
 *
 * @returns {String} language name
 */
export default function getLanguageName(code) {
  // Finds required language name from the code
  console.log('getLanguageName', code);
  for (let i = 0; i < supportedLanguages.length; i++) {
    if (supportedLanguages[i].langCode === code) {
      return supportedLanguages[i].languageName;
    }
  }
}
