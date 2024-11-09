import type { ExtendedCountryCode } from '../../features/common/types/country';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { TextField } from '@mui/material';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../features/common/WebappButton';
import InlineFormDisplayGroup from '../../features/common/Layout/Forms/InlineFormDisplayGroup';
import SelectCountry from '../../features/common/InputTypes/AutoCompleteCountry';
import { allCountries } from '../../utils/constants/countries';

type FormData = {
  address: string;
  alternativeAddress: string | undefined;
  city: string;
  zipCode: string;
  state: string;
};

const AddressForm = ({ mode }) => {
  const defaultAddressDetail = {
    address: '',
    alternativeAddress: '',
    city: '',
    zipCode: '',
    state: '',
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultAddressDetail,
  });
  const t = useTranslations('EditProfile');
  const tMe = useTranslations('Me');
  const tCommon = useTranslations('Common');
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('DE');
  const closeModal = () => {};
  return (
    <div className={styles.addressFormContainer}>
      <h1>{tMe('addressManagement.addAddress')}</h1>
      <form className={styles.addressForm}>
        <Controller
          name="address"
          control={control}
          rules={{
            required: t('validationErrors.addressRequired'),
            pattern: {
              value: /^[\p{L}\p{N}\sß.,#/-]+$/u,
              message: t('validationErrors.addressInvalid'),
            },
          }}
          render={({
            field: { onChange: handleChange, value, onBlur: handleBlur },
          }) => (
            <TextField
              label={t('fieldLabels.address')}
              onChange={(event) => {
                handleChange(event);
              }}
              onBlur={() => handleBlur()}
              value={value}
              error={errors.address !== undefined}
              helperText={
                errors.address !== undefined ? errors.address?.message : null
              }
            />
          )}
        />
        <Controller
          name="alternativeAddress"
          control={control}
          rules={{
            pattern: {
              value: /^[\p{L}\p{N}\sß.,#/-]+$/u,
              message: t('validationErrors.addressInvalid'),
            },
          }}
          render={({
            field: { onChange: handleChange, value, onBlur: handleBlur },
          }) => (
            <TextField
              label={tMe('addressManagement.alternativeAddress')}
              onChange={(event) => {
                handleChange(event);
              }}
              onBlur={() => handleBlur()}
              value={value}
              error={errors.alternativeAddress !== undefined}
              helperText={
                errors.alternativeAddress !== undefined
                  ? errors.alternativeAddress?.message
                  : null
              }
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
                value: /^[\p{L}\sß.,()-]+$/u,
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
                helperText={errors.city !== undefined && errors.city.message}
              />
            )}
          />
          <Controller
            name="zipCode"
            control={control}
            rules={{
              required: t('validationErrors.zipCodeRequired'),
              //   pattern: {
              //     value: postalRegex as RegExp,
              //     message: t('validationErrors.zipCodeInvalid'),
              //   },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('fieldLabels.zipCode')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.zipCode !== undefined}
                helperText={
                  errors.zipCode !== undefined && errors.zipCode.message
                }
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
                value: /^[\p{L}\sß.,()-]+$/u,
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
                helperText={errors.state !== undefined && errors.state.message}
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
          text={tMe('addressManagement.addAddress')}
          variant="primary"
          elementType="button"
          onClick={closeModal}
          buttonClasses={styles.addAddressButton}
        />
      </div>
    </div>
  );
};

export default AddressForm;
