import type { CountryCode, CurrencyCode } from '@planet-sdk/common';

export type ExtendedCountryCode = CountryCode | 'auto';

export interface CountryType {
  code: ExtendedCountryCode;
  label?: string;
  phone?: string;
  currency?: CurrencyCode;
}
