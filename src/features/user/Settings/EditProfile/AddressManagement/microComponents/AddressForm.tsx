import type { AddressSuggestionsType } from '../../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../../common/types/country';
import type { SetState } from '../../../../../common/types/common';
import type { Nullable } from '@planet-sdk/common/build/types/util';
import type { AddressType } from '@planet-sdk/common';

import { useCallback, useMemo, useState } from 'react';
import { CircularProgress, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import {
  ADDRESS_TYPE,
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
import PrimaryAddressToggle from './PrimaryAddressToggle';

export type AddressFormData = {
  address: string;
  address2: Nullable<string>;
  city: string;
  zipCode: string;
  state: Nullable<string>;
};

interface Props {
  country: ExtendedCountryCode | '';
  setCountry: SetState<ExtendedCountryCode | ''>;
  label: string;
  processFormData: (data: AddressFormData) => Promise<void>;
  defaultAddressDetail: AddressFormData & { type: AddressType };
  isLoading: boolean;
  showPrimaryAddressToggle: boolean;
  primaryAddressChecked: boolean;
  setPrimaryAddressChecked: SetState<boolean>;
  handleCancel: () => void;
}

const AddressForm = ({
  country,
  setCountry,
  defaultAddressDetail,
  handleCancel,
  label,
  processFormData,
  isLoading,
  showPrimaryAddressToggle,
  primaryAddressChecked,
  setPrimaryAddressChecked,
}: Props) => {
  const t = useTranslations('EditProfile');
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
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
      try {
        const suggestions = await suggestAddress(value, country);
        setAddressSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to fetch address suggestions:', error);
        setAddressSuggestions([]);
      }
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
      try {
        const details = await fetchAddressDetails(value);
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
    [geocoder, setValue]
  );
  const handleAddressSelect = (address: string) => {
    handleGetAddress(address);
  };

  const resetForm = () => {
    reset(defaultAddressDetail);
    setAddressSuggestions([]);
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
        label={t('addressManagement.addressForm.address2')}
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
            maxLength: {
              value: 15,
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
      {showPrimaryAddressToggle &&
        defaultAddressDetail.type !== ADDRESS_TYPE.PRIMARY && (
          <PrimaryAddressToggle
            primaryAddressChecked={primaryAddressChecked}
            setPrimaryAddressChecked={setPrimaryAddressChecked}
          />
        )}
      {isLoading ? (
        <div className={styles.addressMgmtSpinner}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <AddressFormButtons
          text={label}
          handleSubmit={handleSubmit(processFormData)}
          handleCancel={() => {
            handleCancel();
            resetForm();
          }}
        />
      )}
    </form>
  );
};

export default AddressForm;
