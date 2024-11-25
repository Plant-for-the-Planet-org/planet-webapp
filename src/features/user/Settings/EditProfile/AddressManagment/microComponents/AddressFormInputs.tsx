import type { Control, FieldErrors } from 'react-hook-form';
import type { AddressSuggestionsType } from '../../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../../common/types/country';
import type { SetState } from '../../../../../common/types/common';
import type { FormData } from '../AddressForm';

import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { validationPattern } from '../../../../../../utils/addressManagement';
import InlineFormDisplayGroup from '../../../../../common/Layout/Forms/InlineFormDisplayGroup';
import styles from '../AddressManagement.module.scss';
import AddressInput from './AddressInput';
import CountrySelect from '../../../../../common/InputTypes/AutoCompleteCountry';
import { allCountries } from '../../../../../../utils/constants/countries';

interface Props {
  handleInputChange: (value: string) => void;
  handleAddressSelect: (value: string) => void;
  addressSuggestions: AddressSuggestionsType[];
  control: Control<FormData, any>;
  errors: FieldErrors<FormData>;
  postalRegex: RegExp | undefined;
  country: ExtendedCountryCode | '';
  setCountry: SetState<ExtendedCountryCode | ''>;
}

const AddressFormInputs = ({
  handleInputChange,
  handleAddressSelect,
  addressSuggestions,
  control,
  errors,
  postalRegex,
  country,
  setCountry,
}: Props) => {
  const t = useTranslations('EditProfile');
  const tProfile = useTranslations('Profile');
  return (
    <form className={styles.addressForm}>
      <AddressInput
        name="address"
        control={control}
        label={t('fieldLabels.address')}
        required
        validationPattern={validationPattern.address}
        validationMessages={{
          required: t('validationErrors.addressRequired'),
          invalid: t('validationErrors.addressInvalid'),
        }}
        suggestions={addressSuggestions}
        onInputChange={handleInputChange}
        onAddressSelect={handleAddressSelect}
      />
      <AddressInput
        name="address2"
        control={control}
        label={tProfile('addressManagement.address2')}
        validationPattern={validationPattern.address}
        validationMessages={{
          required: t('validationErrors.addressRequired'),
          invalid: t('validationErrors.addressInvalid'),
        }}
        suggestions={addressSuggestions}
        onInputChange={handleInputChange}
      />
      <InlineFormDisplayGroup>
        <Controller
          name="city"
          control={control}
          rules={{
            required: t('validationErrors.cityRequired'),
            pattern: {
              value: validationPattern.cityState,
              message: t('validationErrors.cityInvalid'),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('fieldLabels.city')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          )}
        />
        <Controller
          name="zipCode"
          control={control}
          rules={{
            required: t('validationErrors.zipCodeRequired'),
            pattern: {
              value: postalRegex as RegExp,
              message: t('validationErrors.zipCodeInvalid'),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('fieldLabels.zipCode')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={!!errors.zipCode}
              helperText={errors.zipCode?.message}
            />
          )}
        />
      </InlineFormDisplayGroup>
      <InlineFormDisplayGroup>
        <Controller
          name="state"
          control={control}
          rules={{
            pattern: {
              value: validationPattern.cityState,
              message: t('validationErrors.stateInvalid'),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('fieldLabels.state')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          )}
        />
        <CountrySelect
          countries={allCountries}
          label={t('fieldLabels.country')}
          name="country"
          defaultValue={country}
          onChange={setCountry}
        />
      </InlineFormDisplayGroup>
    </form>
  );
};

export default AddressFormInputs;
