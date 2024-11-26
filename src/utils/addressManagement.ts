import type { ExtendedCountryCode } from '../features/common/types/country';
import type {
  AddressSuggestionsType,
  AddressType,
} from '../features/common/types/geocoder';

import GeocoderArcGIs from 'geocoder-arcgis';

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

export const addressTypeOrder = ['primary', 'mailing', 'other'];

export const formatAddress = (
  address: string | undefined,
  zipCode: string | undefined,
  city: string | undefined,
  state: string | null,
  country: string
) => {
  const cleanAddress = [address, `${zipCode} ${city}`, state, country]
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

export const geocoder = new GeocoderArcGIs(
  process.env.ESRI_CLIENT_SECRET
    ? {
        client_id: process.env.ESRI_CLIENT_ID,
        client_secret: process.env.ESRI_CLIENT_SECRET,
      }
    : {}
);

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
