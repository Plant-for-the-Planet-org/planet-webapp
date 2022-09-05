/* eslint-disable no-use-before-define */
import { useState, ReactElement, useEffect } from 'react';
import { TextField } from '@mui/material';
import React from 'react';
import i18next from '../../../../i18n';
import { MuiAutoComplete, StyledAutoCompleteOption } from './MuiAutoComplete';
import { CountryType, allCountries } from '../../../utils/constants/countries';
const { useTranslation } = i18next;

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
  label: React.ReactNode;
  name: string | undefined;
  defaultValue: string | undefined; //This will be a country code e.g. DE, IN, US
  onChange: (value: string) => void;
  countries?: CountryType[];
}

export default function CountrySelect({
  label,
  name,
  defaultValue,
  onChange,
  countries = allCountries,
}: CountrySelectProps): ReactElement | null {
  const { t, ready } = useTranslation(['country']);

  // This value is an object with keys - code, label and phone
  // This has to be passed to the component as default value
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );

  // use default country passed to create default object & set country details
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (selectedCountry) {
      onChange(selectedCountry.code);
    }
  }, [selectedCountry]);

  useEffect(() => {
    countries.sort((a, b) => {
      const nameA = t(`country:${a.code.toLowerCase()}`);
      const nameB = t(`country:${b.code.toLowerCase()}`);
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
  }, [ready]);

  return selectedCountry && ready ? (
    <MuiAutoComplete
      id="country-select"
      options={countries}
      value={selectedCountry}
      getOptionLabel={(option) =>
        t(`country:${(option as CountryType).code.toLowerCase()}`)
      }
      isOptionEqualToValue={(option, value) =>
        (option as CountryType).code === (value as CountryType).code
      }
      renderOption={(props, option) => {
        const countryCode = (option as CountryType).code;
        return (
          <StyledAutoCompleteOption {...props} key={countryCode}>
            {countryCode !== 'auto' && (
              <span>{countryToFlag(countryCode)}</span>
            )}
            {name === 'editProfile' || countryCode === 'auto'
              ? t(`country:${countryCode.toLowerCase()}`)
              : t(`country:${countryCode.toLowerCase()}`) + ' ' + countryCode}
          </StyledAutoCompleteOption>
        );
      }}
      onChange={(_event, newValue: unknown) => {
        if (newValue) {
          setSelectedCountry(newValue as CountryType | null);
        }
      }}
      defaultValue={selectedCountry.label}
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
