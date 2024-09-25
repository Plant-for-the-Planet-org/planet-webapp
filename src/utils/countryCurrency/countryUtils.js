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
    }
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    return 0;
  });
}

/**
 * Sorts the countries array for the translated country name
 * @param {Function} tCountry - translation function
 * @param {String} language - language to get country names for
 * @param {Array} priorityCountryCodes - country code to always show first in given order
 * @param {Set<string> | null} supportedCurrencyCodes - supported currency codes (3 letters)
 */

export function sortCountriesByTranslation(
  tCountry,
  language,
  priorityCountryCodes,
  supportedCurrencyCodes
) {
  const key = `${language}.${priorityCountryCodes}`;
  if (!sortedCountries[key]) {
    const priorityCountries = [];
    // filter priority countries from list
    const filteredCountries = countriesData.filter(function (value) {
      // Filter out countries with unsupported currency codes
      if (
        supportedCurrencyCodes &&
        !supportedCurrencyCodes.has(value.currencyCode)
      ) {
        return false;
      }
      if (priorityCountryCodes.includes(value.countryCode)) {
        priorityCountries.push(value);
        return false;
      } else {
        return true;
      }
    });
    // sort array of countries
    sortedCountries[key] = priorityCountries.concat(
      filteredCountries.sort((a, b) => {
        const nameA = tCountry(a.countryCode.toLowerCase());
        const nameB = tCountry(b.countryCode.toLowerCase());
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      })
    );
  }
  return sortedCountries[key];
}
