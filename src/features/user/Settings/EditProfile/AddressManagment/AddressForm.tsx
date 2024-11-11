import type {
  AddressSuggestionsType,
  AddressType,
} from '../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';

import { useState, useContext, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Autocomplete, TextField } from '@mui/material';
import GeocoderArcGIs from 'geocoder-arcgis';
import { APIError, handleError } from '@planet-sdk/common';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../../common/Layout/Forms/InlineFormDisplayGroup';
import SelectCountry from '../../../../common/InputTypes/AutoCompleteCountry';
import { allCountries } from '../../../../../utils/constants/countries';
import COUNTRY_ADDRESS_POSTALS from '../../../../../utils/countryZipCode';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { validationPattern } from '../../../../../utils/addressManagement';

type FormData = {
  address: string;
  address2: string | undefined;
  city: string;
  zipCode: string;
  state: string;
};

interface Props {
  mode: string;
  setIsModalOpen: SetState<boolean>;
}
const geocoder = new GeocoderArcGIs(
  process.env.ESRI_CLIENT_SECRET
    ? {
        client_id: process.env.ESRI_CLIENT_ID,
        client_secret: process.env.ESRI_CLIENT_SECRET,
      }
    : {}
);
const AddressForm = ({ mode, setIsModalOpen }: Props) => {
  const defaultAddressDetail = {
    address: '',
    address2: '',
    city: '',
    zipCode: '',
    state: '',
  };
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
  const t = useTranslations('EditProfile');
  const tProfile = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('DE');
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const [isUploadingData, setIsUploadingData] = useState(false); // This state will be useful to conditionally render loader.

  const suggestAddress = (value: string) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, { category: 'Address', countryCode: country })
        .then((result: { suggestions: AddressSuggestionsType[] }) => {
          const filterdSuggestions = result.suggestions.filter(
            (suggestion: AddressSuggestionsType) => {
              return !suggestion.isCollection;
            }
          );
          setAddressSuggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };

  const getAddress = (value: string) => {
    geocoder
      .findAddressCandidates(value, { outfields: '*' })
      .then((result: AddressType) => {
        setValue('address', result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setValue('city', result.candidates[0].attributes.City, {
          shouldValidate: true,
        });
        setValue('zipCode', result.candidates[0].attributes.Postal, {
          shouldValidate: true,
        });
        setAddressSuggestions([]);
      })
      .catch(console.log);
  };

  const postalRegex = useMemo(() => {
    const filteredCountry = COUNTRY_ADDRESS_POSTALS.find(
      (item) => item.abbrev === country
    );
    return filteredCountry?.postal;
  }, [country]);

  const resetForm = () => {
    reset(defaultAddressDetail);
    setAddressSuggestions([]);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const addNewAddress = async (data: FormData) => {
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: 'other',
    };
    if (contextLoaded && user) {
      try {
        const req = await postAuthenticatedRequest(
          tenantConfig.id,
          '/app/addresses',
          bodyToSend,
          token,
          logoutUser
        );
      } catch (error) {
        setIsUploadingData(false);
        setErrors(handleError(error as APIError));
      } finally {
        setIsUploadingData(false);
      }
    }
  };

  return (
    <div className={styles.addressFormContainer}>
      <h1>{tProfile('addressManagement.addAddress')}</h1>
      <form className={styles.addressForm}>
        <Controller
          name="address"
          control={control}
          rules={{
            required: t('validationErrors.addressRequired'),
            pattern: {
              value: validationPattern.address,
              message: t('validationErrors.addressInvalid'),
            },
          }}
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={addressSuggestions}
              onInputChange={(_, newValue) => {
                suggestAddress(newValue);
                field.onChange(newValue);
              }}
              onChange={(_, newValue) => {
                if (newValue) getAddress(newValue as string);
                field.onChange(
                  typeof newValue === 'string' ? newValue : newValue?.text || ''
                );
              }}
              value={field.value}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option; // Return the string value when typing
                }
                if (typeof option === 'object' && 'text' in option) {
                  return option.text; // Return the text property for suggestion objects
                }
                return '';
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('fieldLabels.address')}
                  error={errors.address !== undefined}
                  helperText={errors.address?.message}
                  inputRef={field.ref}
                  onBlur={field.onBlur}
                />
              )}
            />
          )}
        />
        <Controller
          name="address2"
          control={control}
          rules={{
            pattern: {
              value: validationPattern.address,
              message: t('validationErrors.addressInvalid'),
            },
          }}
          render={({
            field: { onChange: handleChange, value, onBlur: handleBlur },
          }) => (
            <TextField
              label={tProfile('addressManagement.address2')}
              onChange={(event) => {
                handleChange(event);
              }}
              onBlur={() => handleBlur()}
              value={value}
              error={errors.address2 !== undefined}
              helperText={errors.address2?.message}
            />
          )}
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
                error={errors.city !== undefined}
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
                error={errors.zipCode !== undefined}
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
                error={errors.state !== undefined}
                helperText={errors.state?.message}
              />
            )}
          />
          <SelectCountry
            countries={allCountries}
            label={t('fieldLabels.country')}
            name="country"
            defaultValue={country}
            onChange={setCountry}
          />
        </InlineFormDisplayGroup>
      </form>
      <div className={styles.formButtonContainer}>
        <WebappButton
          text={tCommon('cancel')}
          variant="secondary"
          elementType="button"
          onClick={closeModal}
          buttonClasses={styles.cancelButton}
        />
        <WebappButton
          text={tProfile('addressManagement.addAddress')}
          variant="primary"
          elementType="button"
          onClick={handleSubmit(addNewAddress)}
          buttonClasses={styles.addAddressButton}
        />
      </div>
    </div>
  );
};

export default AddressForm;
