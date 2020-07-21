import countriesData from './countriesData.json';

/**
 * * Returns country details by searching country data json file and options
 * @param {String} countryCode - Country Code
 *
 * @returns {Object} contains
 *  - {countryName, currencyName, currencyCode, currencyCountryFlag}
 */
export function getCountryData(countryCode) {
  // Finds required country data from the country data array and return the
  // required value from options
  for (let i = 0; i < countriesData.length; i++) {
    if (countriesData[i].countryCode === countryCode) {
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
  return countriesData.sort(function (a, b) {
    if (a[sortBy] > b[sortBy]) {
      return 1;
    } else if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    return 0;
  });
}
