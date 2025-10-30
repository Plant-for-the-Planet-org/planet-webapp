import type { AddressSuggestionsType } from '../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../common/types/country';
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { SignupFormData } from '..';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { MuiTextField } from '..';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getPostalRegex } from '../../../../utils/addressManagement';
import {
  getAddressDetailsFromText,
  getAddressSuggestions,
} from '../../../../utils/geocoder';
import { useDebouncedEffect } from '../../../../utils/useDebouncedEffect';

interface SignupAddressFieldProps {
  control: Control<SignupFormData>;
  country: '' | ExtendedCountryCode;
  errors: FieldErrors<SignupFormData>;
  setValue: UseFormSetValue<SignupFormData>;
  defaultCity: string;
  defaultPostalCode: string;
}

const SignupAddressField = ({
  control,
  country,
  errors,
  setValue,
  defaultCity,
  defaultPostalCode,
}: SignupAddressFieldProps) => {
  const tSignup = useTranslations('EditProfile');
  const postalRegex = useMemo(() => getPostalRegex(country), [country]);

  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const latestRequestIdRef = useRef(0);

  const handleSuggestAddress = useCallback(
    async (value: string) => {
      // Bump request ID to track the latest API call
      latestRequestIdRef.current++;
      const currentRequestId = latestRequestIdRef.current;
      try {
        const suggestions = await getAddressSuggestions(value, country);
        // Only update if this is still the latest request
        if (currentRequestId === latestRequestIdRef.current) {
          setAddressSuggestions(suggestions);
        }
      } catch (error) {
        console.error('Failed to fetch address suggestions:', error);
        // Prevent outdated error responses from affecting UI
        if (currentRequestId === latestRequestIdRef.current) {
          setAddressSuggestions([]);
        }
      }
    },
    [country]
  );

  const handleAddressSelection = useCallback(
    async (value: string) => {
      try {
        const details = await getAddressDetailsFromText(value);
        if (details) {
          setValue('address', details.address, { shouldValidate: true });
          setValue('city', details.city, { shouldValidate: true });
          setValue('zipCode', details.zipCode, { shouldValidate: true });
        }
        setAddressSuggestions([]);
      } catch (error) {
        console.error('Failed to fetch address details:', error);
      }
    },
    [setValue]
  );

  useDebouncedEffect(
    () => {
      const trimmedInput = addressInput.trim();

      // Clear suggestions if input is empty or just whitespace
      if (trimmedInput === '') {
        setAddressSuggestions([]);
        return;
      }

      // Fetch suggestions only if input is meaningful (e.g., length > 3)
      handleSuggestAddress(trimmedInput);
    },
    700,
    [addressInput]
  );

  return (
    <>
      <Controller
        name="address"
        control={control}
        rules={{
          required: tSignup('validationErrors.addressRequired'),
          pattern: {
            value: /^[\p{L}\p{N}\sß.,#/-]+$/u,
            message: tSignup('validationErrors.addressInvalid'),
          },
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <MuiTextField
            label={tSignup('fieldLabels.address')}
            error={errors.address !== undefined}
            helperText={errors.address !== undefined && errors.address.message}
            onChange={(event) => {
              setAddressInput(event.target.value);
              onChange(event.target.value);
            }}
            onBlur={() => {
              setAddressSuggestions([]);
              onBlur();
            }}
            value={value}
          />
        )}
      />
      {addressSuggestions
        ? addressSuggestions.length > 0 && (
            <div
              role="listbox"
              aria-label={tSignup('addressManagement.addressSuggestions')}
            >
              {addressSuggestions.map((suggestion, index) => {
                return (
                  <div
                    key={index}
                    onMouseDown={() => {
                      handleAddressSelection(suggestion.text);
                    }}
                    role="option"
                    aria-selected={false}
                  >
                    {suggestion.text}
                  </div>
                );
              })}
            </div>
          )
        : null}
      <InlineFormDisplayGroup>
        <Controller
          name="city"
          control={control}
          rules={{
            required: tSignup('validationErrors.cityRequired'),
            pattern: {
              value: /^[\p{L}\sß.,()-]+$/u,
              message: tSignup('validationErrors.cityInvalid'),
            },
          }}
          defaultValue={defaultCity}
          render={({ field: { onChange, value, onBlur } }) => (
            <MuiTextField
              label={tSignup('fieldLabels.city')}
              error={errors.city !== undefined}
              helperText={errors.city !== undefined && errors.city.message}
              onChange={onChange}
              value={value}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name="zipCode"
          control={control}
          rules={{
            required: tSignup('validationErrors.zipCodeRequired'),
            ...(postalRegex
              ? {
                  pattern: {
                    value: postalRegex,
                    message: tSignup('validationErrors.zipCodeInvalid'),
                  },
                }
              : {}),
            maxLength: {
              value: 15,
              message: tSignup('validationErrors.zipCodeInvalid'),
            },
          }}
          defaultValue={defaultPostalCode}
          render={({ field: { onChange, value, onBlur } }) => (
            <MuiTextField
              label={tSignup('fieldLabels.zipCode')}
              error={errors.zipCode !== undefined}
              helperText={
                errors.zipCode !== undefined && errors.zipCode.message
              }
              onChange={onChange}
              value={value}
              onBlur={onBlur}
            />
          )}
        />
      </InlineFormDisplayGroup>
    </>
  );
};

export default SignupAddressField;
