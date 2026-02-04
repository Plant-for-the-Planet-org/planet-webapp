import type { Country, CountryCode, CurrencyCode } from '@planet-sdk/common';
import countriesData from './countriesData.json';

const typedCountriesData = countriesData as Country[];

const sortedCountries: Record<string, Country[]> = {};

/**
 * Returns country details by searching country data json file and options
 * @param key - deciding factor to find country data from can hold values
 *        countryCode || countryName || currencyName || currencyCode || currencyCountryFlag
 * @param value - value of the key to compare with
 * @returns Country object or undefined if not found
 */
export function getCountryDataBy(
  key: keyof Country,
  value: string
): Country | undefined {
  return typedCountriesData.find((country) => country[key] === value);
}

/**
 * Sorts the countries array in the required format
 * @param sortBy - can have values
 *    countryName, currencyName, currencyCode, currencyCountryFlag
 */
export function sortCountriesData(sortBy: keyof Country): Country[] {
  return [...typedCountriesData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal > bVal) return 1;
    if (aVal < bVal) return -1;
    return 0;
  });
}

/**
 * Sorts the countries array for the translated country name
 * @param tCountry - translation function
 * @param language - language to get country names for
 * @param priorityCountryCodes - country code to always show first in given order
 * @param supportedCurrencyCodes - supported currency codes (3 letters)
 */
export function sortCountriesByTranslation(
  tCountry: (key: Lowercase<CountryCode>) => string,
  language: string,
  priorityCountryCodes: string[],
  supportedCurrencyCodes: Set<CurrencyCode> | null
): Country[] {
  const key = `${language}.${priorityCountryCodes.join(',')}`;

  if (!sortedCountries[key]) {
    const priorityCountries: Country[] = [];

    // filter priority countries from list
    const filteredCountries = typedCountriesData.filter((country) => {
      // Filter out countries with unsupported currency codes
      if (
        supportedCurrencyCodes &&
        !supportedCurrencyCodes.has(country.currencyCode)
      ) {
        return false;
      }

      if (priorityCountryCodes.includes(country.countryCode)) {
        priorityCountries.push(country);
        return false;
      }
      return true;
    });

    // sort array of countries
    sortedCountries[key] = priorityCountries.concat(
      filteredCountries.sort((a, b) => {
        const nameA = tCountry(
          a.countryCode.toLowerCase() as Lowercase<CountryCode>
        );
        const nameB = tCountry(
          b.countryCode.toLowerCase() as Lowercase<CountryCode>
        );
        if (nameA > nameB) return 1;
        if (nameA < nameB) return -1;
        return 0;
      })
    );
  }

  return sortedCountries[key];
}
