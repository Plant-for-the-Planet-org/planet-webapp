import type { AddressSuggestionsType } from '../../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../../common/types/country';
import type { FormData } from '../AddAddress';
import type { SetState } from '../../../../../common/types/common';
import type { Nullable } from '@planet-sdk/common/build/types/util';

import { useCallback, useMemo, useState } from 'react';
import { CircularProgress, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import {
  fetchAddressDetails,
  geocoder,
  getPostalRegex,
  suggestAddress,
  validationPattern,
} from '../../../../../../utils/addressManagement';
import InlineFormDisplayGroup from '../../../../../common/Layout/Forms/InlineFormDisplayGroup';
import styles from '../AddressManagement.module.scss';
import AddressInput from './AddressInput';
import CountrySelect from '../../../../../common/InputTypes/AutoCompleteCountry';
import { allCountries } from '../../../../../../utils/constants/countries';
import AddressFormButtons from './AddressFormButtons';
import { useDebouncedEffect } from '../../../../../../utils/useDebouncedEffect';

interface Props {
  country: ExtendedCountryCode | '';
  setCountry: SetState<ExtendedCountryCode | ''>;
  label: string;
  processFormData: (data: FormData) => Promise<void>;
  defaultAddressDetail: {
    address: string | undefined;
    address2: Nullable<string> | undefined;
    city: string | undefined;
    zipCode: string | undefined;
    state: Nullable<string> | undefined;
  };
  setIsModalOpen: SetState<boolean>;
  isLoading: boolean;
}

const AddressForm = ({
  country,
  setCountry,
  defaultAddressDetail,
  setIsModalOpen,
  label,
  processFormData,
  isLoading,
}: Props) => {
  const t = useTranslations('EditProfile');
  const tAddressManagement = useTranslations('Profile');
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultAddressDetail,
  });
  const [inputValue, setInputValue] = useState('');
  const postalRegex = useMemo(() => getPostalRegex(country), [country]);
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSuggestAddress = useCallback(
    async (value: string) => {
      const suggestions = await suggestAddress(value, country);
      setAddressSuggestions(suggestions);
    },
    [geocoder, country]
  );

  useDebouncedEffect(
    () => {
      if (inputValue) {
        handleSuggestAddress(inputValue);
      }
    },
    700,
    [inputValue]
  );
  const handleGetAddress = useCallback(
    async (value: string) => {
      const details = await fetchAddressDetails(value);
      if (details) {
        setValue('address', details.address, { shouldValidate: true });
        setValue('city', details.city, { shouldValidate: true });
        setValue('zipCode', details.zipCode, { shouldValidate: true });
      }
      setAddressSuggestions([]);
    },
    [geocoder, setValue]
  );
  const handleAddressSelect = (address: string) => {
    handleGetAddress(address);
  };

  const resetForm = () => {
    reset(defaultAddressDetail);
    setAddressSuggestions([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };
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
        label={tAddressManagement('addressManagement.address2')}
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
      {isLoading ? (
        <div className={styles.addressMgmtSpinner}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <AddressFormButtons
          text={label}
          handleSubmit={handleSubmit(processFormData)}
          handleCancel={handleCancel}
        />
      )}
    </form>
  );
};

export default AddressForm;
