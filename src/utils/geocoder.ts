import type {
  AddressSuggestionsType,
  AddressType,
  ReverseAddress,
} from '../features/common/types/geocoder';

import GeocoderArcGIS from 'geocoder-arcgis';

const geocoder = new GeocoderArcGIS(
  process.env.ESRI_CLIENT_ID && process.env.ESRI_CLIENT_SECRET
    ? {
        client_id: process.env.ESRI_CLIENT_ID,
        client_secret: process.env.ESRI_CLIENT_SECRET,
      }
    : {}
);

/**
 * Provides address suggestions for a given input string and country.
 */
export const getAddressSuggestions = async (
  value: string,
  country: string
): Promise<AddressSuggestionsType[]> => {
  if (value.length <= 3) return [];
  try {
    const result = await geocoder.suggest(value, {
      category: 'Address',
      countryCode: country,
    });
    return result.suggestions.filter(
      (s: AddressSuggestionsType) => !s.isCollection
    );
  } catch (error) {
    console.error('Failed to fetch address suggestions:', error);
    return [];
  }
};

/**
 * Fetches full address details (short label, city, zip code) for a given input string.
 */
export const getAddressDetailsFromText = async (
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
    const candidate = result.candidates[0]?.attributes;
    if (!candidate) return null;
    return {
      address: candidate.ShortLabel,
      city: candidate.City,
      zipCode: candidate.Postal,
    };
  } catch (error) {
    console.error('Failed to fetch address :', error);
    return null;
  }
};

/**
 * Performs reverse geocoding to get address details from latitude and longitude.
 */
export const getAddressFromCoordinates = async (
  lat: number,
  long: number
): Promise<ReverseAddress | null> => {
  if (lat < -90 || lat > 90 || long < -180 || long > 180) {
    console.error('Invalid coordinates provided:', { lat, long });
    return null;
  }

  try {
    const result = await geocoder.reverse(`${long}, ${lat}`, {
      maxLocations: 10,
      distance: 100,
    });
    return result;
  } catch (error) {
    console.error('Failed to fetch address:', error);
    return null;
  }
};
