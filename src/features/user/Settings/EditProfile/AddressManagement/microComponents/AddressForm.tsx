import type { ExtendedCountryCode } from '../../../../../common/types/country';
import type { SetState } from '../../../../../common/types/common';
import type { Nullable } from '@planet-sdk/common/build/types/util';
import type { AddressType } from '@planet-sdk/common';
import type { ResolvedAddress } from '../../../../../../hooks/useAddressSuggestions';

import { useCallback, useMemo } from 'react';
import { CircularProgress, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import {
  ADDRESS_TYPE,
  validationPattern,
} from '../../../../../../utils/addressManagement';
import InlineFormDisplayGroup from '../../../../../common/Layout/Forms/InlineFormDisplayGroup';
import styles from '../AddressManagement.module.scss';
import AddressAutocomplete from '../../../../../common/InputTypes/AddressAutocomplete';
import CountrySelect from '../../../../../common/InputTypes/AutoCompleteCountry';
import { allCountries } from '../../../../../../utils/constants/countries';
import AddressFormButtons from './AddressFormButtons';
import PrimaryAddressToggle from './PrimaryAddressToggle';
import { useAddressSuggestions } from '../../../../../../hooks/useAddressSuggestions';
import { getPostalRegex } from '../../../../../../utils/addressManagement';

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
  const postalRegex = useMemo(() => getPostalRegex(country), [country]);

  const applyResolvedAddress = useCallback(
    (details: ResolvedAddress) => {
      setValue('address', details.address, { shouldValidate: true });
      setValue('city', details.city, { shouldValidate: true });
      setValue('zipCode', details.zipCode, { shouldValidate: true });
    },
    [setValue]
  );

  const { suggestions, handleInputChange, selectSuggestion, clearSuggestions } =
    useAddressSuggestions({
      country,
      onAddressResolved: applyResolvedAddress,
    });

  const resetForm = () => {
    reset(defaultAddressDetail);
    clearSuggestions();
  };

  return (
    <form className={styles.addressForm}>
      <AddressAutocomplete<AddressFormData>
        name="address"
        control={control}
        label={t('fieldLabels.address')}
        required
        validationPattern={validationPattern.address}
        validationMessages={{
          required: t('validationErrors.addressRequired'),
          invalid: t('validationErrors.addressInvalid'),
        }}
        suggestions={suggestions}
        onInputChange={handleInputChange}
        onSuggestionSelect={selectSuggestion}
      />
      <AddressAutocomplete<AddressFormData>
        name="address2"
        control={control}
        label={t('addressManagement.addressForm.address2')}
        validationPattern={validationPattern.address}
        validationMessages={{
          required: t('validationErrors.addressRequired'),
          invalid: t('validationErrors.addressInvalid'),
        }}
        suggestions={suggestions}
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
        <div className={styles.loadingSpinner}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <AddressFormButtons
          text={label}
          handleSubmit={handleSubmit(processFormData)}
          handleCancel={() => {
            resetForm();
            handleCancel();
          }}
        />
      )}
    </form>
  );
};

export default AddressForm;
