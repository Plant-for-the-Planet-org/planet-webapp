import type { Address } from '@planet-sdk/common';
import type { ExtendedCountryCode } from '../features/common/types/country';
import type {
  AddressSuggestionsType,
  AddressType,
} from '../features/common/types/geocoder';

import GeocoderArcGIs from 'geocoder-arcgis';
import COUNTRY_ADDRESS_POSTALS from './countryZipCode';

export const ADDRESS_TYPE = {
  PRIMARY: 'primary',
  MAILING: 'mailing',
  OTHER: 'other',
} as const;

export const ADDRESS_ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  SET_PRIMARY: 'setPrimary',
  SET_BILLING: 'setBilling',
} as const;

export const ADDRESS_FORM_TYPE = {
  ADD_ADDRESS: 'add',
  EDIT_ADDRESS: 'edit',
} as const;
export const addressTypeOrder = ['primary', 'mailing', 'other'];

export const MAX_ADDRESS_LIMIT = 5;

export const getFormattedAddress = (
  zipCode: string | undefined,
  city: string | undefined,
  state: string | null | undefined,
  countryName: string
) => {
  const cleanAddress = [zipCode, city, state, countryName]
    .filter(Boolean)
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleanAddress;
};

export const validationPattern = {
  address: /^[\p{L}\p{N}\sß.,#/-]+$/u,
  cityState: /^[\p{L}\sß.,()-]+$/u,
};

export const findAddressByType = (
  addresses: Address[],
  addressType: 'primary' | 'mailing'
) => {
  return addresses.find((address) => address.type === addressType);
};

export const geocoder = new GeocoderArcGIs(
  process.env.ESRI_CLIENT_SECRET
    ? {
        client_id: process.env.ESRI_CLIENT_ID,
        client_secret: process.env.ESRI_CLIENT_SECRET,
      }
    : {}
);

/**
 * Suggests address options based on user input.
 *
 * This function queries the geocoder's `suggest` method with the provided input value
 * and optional country code to fetch address suggestions categorized as "AddressPanel".
 * It filters out suggestions marked as collections (`isCollection`) to ensure only
 * individual address suggestions are returned.
 *
 * @param value - The input string to search for address suggestions.
 * @param country - The optional country code to narrow down the address suggestions.
 * @returns A promise that resolves to an array of valid address suggestions or an empty array.
 */

export const suggestAddress = async (
  value: string,
  country: ExtendedCountryCode | ''
): Promise<AddressSuggestionsType[]> => {
  if (value.length > 3) {
    try {
      const result = await geocoder.suggest(value, {
        category: 'Address',
        countryCode: country,
      });
      return result.suggestions.filter(
        (suggestion: AddressSuggestionsType) => !suggestion.isCollection
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  return [];
};

/**
 * Fetches detailed address information based on the input value.
 *
 * This function uses the geocoder's `findAddressCandidates` method to search for
 * address candidates and retrieves key information such as formatted address, city,
 * and postal code (ZIP code). If no candidates are found, it returns `null`.
 *
 * @param value - The input string to search for address details.
 * @returns A promise that resolves to an object containing address details (address, city, zipCode)
 *          or `null` if no candidates are found or an error occurs.
 */
export const fetchAddressDetails = async (
  value: string
): Promise<{
  address: string;
  city: string;
  zipCode: string;
} | null> => {
  try {
    const result: AddressType = await geocoder.findAddressCandidates(value, {
      outfields: '*',
    });
    if (result.candidates.length > 0) {
      const { ShortLabel, City, Postal } = result.candidates[0].attributes;
      return {
        address: ShortLabel,
        city: City,
        zipCode: Postal,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Retrieves the postal regex for a given country code.
 *
 * This function searches the `COUNTRY_ADDRESS_POSTALS` array for the country matching the provided
 * `country` code and returns the associated postal regex pattern. If no match is found, it returns `undefined`.
 *
 * @param country - The country code for which to retrieve the postal regex.
 * @returns The postal regex pattern for the given country, or `undefined` if no match is found.
 */
export const getPostalRegex = (country: ExtendedCountryCode | '') => {
  const filteredCountry = COUNTRY_ADDRESS_POSTALS.find(
    (item) => item.abbrev === country
  );
  return filteredCountry?.postal;
};
