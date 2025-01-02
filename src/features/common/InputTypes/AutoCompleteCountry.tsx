/* eslint-disable no-use-before-define */
import type { ReactElement, ReactNode } from 'react';
import type { CountryType, ExtendedCountryCode } from '../types/country';
import type { SetState } from '../types/common';
import type { CountryCode } from '@planet-sdk/common';

import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { MuiAutoComplete, StyledAutoCompleteOption } from './MuiAutoComplete';
import { allCountries } from '../../../utils/constants/countries';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

interface CountrySelectProps {
  label?: ReactNode;
  name: string | undefined;
  defaultValue: string | undefined; //This will be a country code e.g. DE, IN, US
  onChange: SetState<ExtendedCountryCode | ''>;
  countries?: CountryType[];
}

export default function CountrySelect({
  label,
  name,
  defaultValue,
  onChange,
  countries = allCountries,
}: CountrySelectProps): ReactElement | null {
  const t = useTranslations('Country');

  // This value is an object with keys - code, label and phone
  // This has to be passed to the component as default value
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );

  // use default country passed to create default object & set country details
  useEffect(() => {
    // create default object
    const defaultCountry = countries.filter(
      (data) => data.code === defaultValue
    );
    if (defaultCountry && defaultCountry.length > 0) {
      // set initial value
      setSelectedCountry(defaultCountry[0]);
      // set country details
      onChange(defaultCountry[0].code);
    }
  }, []);

  // Set country everytime value changes
  useEffect(() => {
    if (selectedCountry) {
      onChange(selectedCountry.code);
    }
  }, [selectedCountry]);

  useEffect(() => {
    countries.sort((a, b) => {
      const nameA = t(a.code.toLowerCase() as Lowercase<CountryCode>);
      const nameB = t(b.code.toLowerCase() as Lowercase<CountryCode>);

      //Automatic Selection option is always at first position (if present)
      if (a.code === 'auto') return -1;
      if (b.code === 'auto') return 1;

      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  }, []);

  return selectedCountry ? (
    <MuiAutoComplete
      id="country-select"
      options={countries}
      value={selectedCountry}
      getOptionLabel={(option) => {
        const { code: countryCode, currency } = option as CountryType;
        const label =
          (currency ? `(${currency}) ` : '') +
          t(countryCode.toLowerCase() as Lowercase<CountryCode>);
        return label;
      }}
      isOptionEqualToValue={(option, value) =>
        (option as CountryType).code === (value as CountryType).code
      }
      renderOption={(props, option) => {
        const { code: countryCode, currency } = option as CountryType;
        const displayedOption =
          (currency ? `(${currency}) ` : '') +
          t(countryCode.toLowerCase() as Lowercase<CountryCode>) +
          (!(name == 'editProfile' || countryCode === 'auto')
            ? ` ${countryCode}`
            : '');
        return (
          <StyledAutoCompleteOption {...props} key={countryCode}>
            {countryCode !== 'auto' && (
              <span>{countryToFlag(countryCode)}</span>
            )}
            {displayedOption}
          </StyledAutoCompleteOption>
        );
      }}
      onChange={(_event, newValue: unknown) => {
        if (newValue) {
          setSelectedCountry(newValue as CountryType | null);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          color="primary"
          name={'countrydropdown'}
        />
      )}
    />
  ) : null;
}
