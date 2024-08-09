import { ChangeEvent, ReactElement, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import StyledForm from '../../../common/Layout/StyledForm';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { PayoutCurrency } from '../../../../utils/constants/payoutConstants';
import { useTranslations } from 'next-intl';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { BankAccount } from '../../../common/types/payouts';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import { getStoredConfig } from '../../../../utils/storeConfig';

export type FormData = {
  currency: string;
  payoutMinAmount?: string;
  bankName: string;
  bankCountry: string;
  bankAddress: string;
  holderName: string;
  holderAddress: string;
  accountNumber: string;
  routingNumber: string;
  bic: string;
  branchCode: string;
  remarks: string;
};

interface Props {
  payoutMinAmounts: { [key: string]: number } | null;
  account?: BankAccount;
  handleSave: (data: FormData) => Promise<void>;
  isProcessing: boolean;
}

const extractFormValues = (account?: BankAccount): FormData => {
  const formValues = {
    currency: account?.currency || PayoutCurrency.DEFAULT,
    payoutMinAmount: account?.payoutMinAmount?.toString() || '',
    bankName: account?.bankName || '',
    bankCountry: account?.bankCountry || '',
    bankAddress: account?.bankAddress || '',
    holderName: account?.holderName || '',
    holderAddress: account?.holderAddress || '',
    accountNumber: account?.accountNumber || '',
    routingNumber: account?.routingNumber || '',
    bic: account?.bic || '',
    branchCode: account?.branchCode || '',
    remarks: account?.remarks || '',
  };

  return formValues;
};

const BankDetailsForm = ({
  payoutMinAmounts,
  account,
  handleSave,
  isProcessing,
}: Props): ReactElement | null => {
  const t = useTranslations('ManagePayouts');
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: extractFormValues(account),
  });
  const currency = watch('currency');

  const handlePayoutChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  const validateMinPayout = useCallback(
    (value?: string): boolean | string | undefined => {
      if (payoutMinAmounts) {
        const minAmount = payoutMinAmounts[currency];
        return (
          (value !== undefined && parseInt(value) >= minAmount) ||
          t('errors.payoutMinAmountTooLow', { currency, minAmount })
        );
      }
    },
    [payoutMinAmounts, currency]
  );

  const onSubmit = (data: FormData): void => {
    handleSave(data);
  };

  const renderCurrencyOptions = useCallback((): ReactElement[] => {
    const currencyOptions: { label: string; value: string }[] = [
      { label: t('defaultCurrency'), value: PayoutCurrency.DEFAULT },
    ];
    if (payoutMinAmounts) {
      Object.keys(payoutMinAmounts).forEach((currency) =>
        currencyOptions.push({ label: currency, value: currency })
      );
    }
    return currencyOptions.map((option, index) => {
      return (
        <MenuItem value={option.value} key={index}>
          {option.label}
        </MenuItem>
      );
    });
  }, [payoutMinAmounts]);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="inputContainer">
        <ReactHookFormSelect
          name="currency"
          label={t('labels.currency') + '*'}
          control={control}
          helperText={t('helperText.currency')}
          defaultValue={PayoutCurrency.DEFAULT}
        >
          {renderCurrencyOptions()}
        </ReactHookFormSelect>
        {currency !== PayoutCurrency.DEFAULT && payoutMinAmounts !== null && (
          <Controller
            name="payoutMinAmount"
            control={control}
            rules={{
              required: t('errors.payoutMinAmountRequired'),
              validate: {
                isLow: validateMinPayout,
              },
            }}
            render={({ field: { onChange: handleChange, value, onBlur } }) => (
              <TextField
                label={t('labels.payoutMinAmount') + '*'}
                placeholder={t('placeholders.payoutMinAmount', {
                  currency,
                  minAmount: payoutMinAmounts[currency],
                })}
                onChange={(event) => {
                  handlePayoutChange(event);
                  handleChange(event);
                }}
                value={value}
                onBlur={onBlur}
                error={errors.payoutMinAmount !== undefined}
                helperText={
                  errors.payoutMinAmount !== undefined &&
                  errors.payoutMinAmount.message
                }
              />
            )}
          />
        )}
        <Controller
          name="bankName"
          control={control}
          rules={{ required: t('errors.bankNameRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('labels.bankName') + '*'}
              placeholder={t('placeholders.bankName')}
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              error={errors.bankName !== undefined}
              helperText={
                errors.bankName !== undefined && errors.bankName.message
              }
            />
          )}
        />
        <Controller
          name="bankCountry"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <AutoCompleteCountry
              label={t('labels.bankCountry')}
              name={name}
              defaultValue={
                value ||
                (getStoredConfig('loc').countryCode === 'T1' ||
                getStoredConfig('loc').countryCode === 'XX' ||
                getStoredConfig('loc').countryCode === ''
                  ? ''
                  : getStoredConfig('loc').countryCode)
              }
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="bankAddress"
          control={control}
          rules={{ required: t('errors.bankAddressRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              label={t('labels.bankAddress') + '*'}
              placeholder={t('placeholders.bankAddress')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.bankAddress !== undefined}
              helperText={
                errors.bankAddress !== undefined && errors.bankAddress.message
              }
            />
          )}
        />
        <Controller
          name="holderName"
          control={control}
          rules={{ required: t('errors.holderNameRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('labels.holderName') + '*'}
              placeholder={t('placeholders.holderName')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.holderName !== undefined}
              helperText={
                errors.holderName !== undefined && errors.holderName.message
              }
            />
          )}
        />
        <Controller
          name="holderAddress"
          control={control}
          rules={{ required: t('errors.holderAddressRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              label={t('labels.holderAddress') + '*'}
              placeholder={t('placeholders.holderAddress')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.holderAddress !== undefined}
              helperText={
                errors.holderAddress !== undefined &&
                errors.holderAddress.message
              }
            />
          )}
        />
        <InlineFormDisplayGroup>
          <Controller
            name="accountNumber"
            control={control}
            rules={{ required: t('errors.accountNumberRequired') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('labels.accountNumber') + '*'}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.accountNumber !== undefined}
                helperText={
                  errors.accountNumber !== undefined &&
                  errors.accountNumber.message
                }
              />
            )}
          />
          <Controller
            name="routingNumber"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('labels.routingNumber')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        </InlineFormDisplayGroup>
        <InlineFormDisplayGroup>
          <Controller
            name="bic"
            control={control}
            rules={{ required: t('errors.bicRequired') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('labels.bic') + '*'}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.bic !== undefined}
                helperText={errors.bic !== undefined && errors.bic.message}
              />
            )}
          />
          <Controller
            name="branchCode"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('labels.branchCode')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        </InlineFormDisplayGroup>
        <Controller
          name="remarks"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              label={t('labels.remarks')}
              placeholder={t('placeholders.remarks')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              helperText={t('helperText.remarks')}
            />
          )}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        className="formButton"
        type="submit"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <CircularProgress color="primary" size={24} />
        ) : (
          t('saveButton')
        )}
      </Button>
    </StyledForm>
  );
};

export default BankDetailsForm;
