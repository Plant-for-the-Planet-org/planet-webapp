import type { ExtendedCountryCode } from '../../../common/types/country';
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { SignupFormData } from '..';
import type { ResolvedAddress } from '../../../common/types/geocoder';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { MuiTextField } from '..';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import AddressAutocomplete from '../../../common/InputTypes/AddressAutocomplete';
import { useCallback, useMemo } from 'react';
import {
  getPostalRegex,
  validationPattern,
} from '../../../../utils/addressManagement';
import { useAddressSuggestions } from '../../../../hooks/useAddressSuggestions';

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

  const applyResolvedAddress = useCallback(
    (details: ResolvedAddress) => {
      setValue('address', details.address, { shouldValidate: true });
      setValue('city', details.city, { shouldValidate: true });
      setValue('zipCode', details.zipCode, { shouldValidate: true });
    },
    [setValue]
  );

  const { suggestions, handleInputChange, selectSuggestion } =
    useAddressSuggestions({
      country,
      onAddressResolved: applyResolvedAddress,
    });

  return (
    <>
      <AddressAutocomplete<SignupFormData>
        name="address"
        control={control}
        label={tSignup('fieldLabels.address')}
        required
        validationPattern={validationPattern.address}
        validationMessages={{
          required: tSignup('validationErrors.addressRequired'),
          invalid: tSignup('validationErrors.addressInvalid'),
        }}
        suggestions={suggestions}
        onInputChange={handleInputChange}
        onSuggestionSelect={selectSuggestion}
        // The signup form container centers its children, so the field has to
        // opt in to full width.
        fullWidth
        autoComplete="street-address"
      />
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
              autoComplete="address-level2"
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
              autoComplete="postal-code"
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
