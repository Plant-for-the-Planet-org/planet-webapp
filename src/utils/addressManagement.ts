import type { Address } from '@planet-sdk/common';
import type { ExtendedCountryCode } from '../features/common/types/country';

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
  UNSET_BILLING: 'unsetBilling',
} as const;

export const ADDRESS_FORM_TYPE = {
  ADD_ADDRESS: 'add',
  EDIT_ADDRESS: 'edit',
} as const;
export const addressTypeOrder = ['primary', 'mailing', 'other'];

export const MAX_ADDRESS_LIMIT = 5;

export const getFormattedAddress = (
  zipCode: string | null,
  city: string | null,
  state: string | null,
  countryName: string
) => {
  return [zipCode, city, state, countryName]
    .filter(Boolean)
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();
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
