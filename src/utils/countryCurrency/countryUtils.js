import countriesData from './countriesData.json';

const sortedCountries = [];

/**
 * * Returns country details by searching country data json file and options
 * @param {String} key - deciding factor to find country data from can hold values
 *        countryCode || countryName || currencyName || currencyCode || currencyCountryFlag
 *
 * @param {String} value - value of the key to compare with
 *
 * @returns {Object} contains
 *  - {countryCode, countryName, currencyName, currencyCode, currencyCountryFlag}
 */
// eslint-disable-next-line consistent-return
export function getCountryDataBy(key, value) {
  // Finds required country data from the country data array and returns the
  // matched country result
  for (let i = 0; i < countriesData.length; i += 1) {
    if (countriesData[i][key] === value) {
      return countriesData[i];
    }
  }
}

/**
 * Sorts the countries array in the required format
 * @param {String} sortBy - can have values
 *    countryName, currencyName, currencyCode, currencyCountryFlag
 */
export function sortCountriesData(sortBy) {
  // returns a sorted array which is sorted by passed value
  return countriesData.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return 1;
    } if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    return 0;
  });
}

/**
 * Sorts the countries array for the translated country name
 * @param {Function} t - translation function
 */
export function sortCountriesByTranslation(t, language) {
  if (!sortedCountries[language]) {
    // returns a sorted array
    sortedCountries[language] = countriesData.sort((a, b) => {
      const nameA = t(`country:${a.countryCode.toLowerCase()}`);
      const nameB = t(`country:${b.countryCode.toLowerCase()}`);
      if (nameA > nameB) {
        return 1;
      } if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  }
  return sortedCountries[language];
}
