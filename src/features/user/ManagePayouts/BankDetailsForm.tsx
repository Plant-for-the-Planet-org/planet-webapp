import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, MenuItem, styled } from '@mui/material';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';
import ReactHookFormSelect from './ReactHookFormSelect';

const { useTranslation } = i18n;

const InlineFormGroup = styled('div')({
  display: 'flex',
  columnGap: 16,
  rowGap: 24,
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',

  '& .MuiTextField-root': {
    flex: 1,
    minWidth: 240,
  },
});

type FormData = {
  currency: string;
  payoutMinAmount: string;
  bankName: string;
  bankAddress: string;
  holderName: string;
  holderAddress: string;
  accountNumber: string;
  routingNumber: string;
  bic: string;
  branchCode: string;
  remarks: string;
};

const minPayoutAmounts = {
  Default: undefined,
  CHF: 1500,
  CZK: 1500,
  EUR: 1500,
  USD: 1500,
};

const BankDetailsForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');
  const { register, handleSubmit, errors, control } = useForm<FormData>({
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const renderCurrencyOptions = () => {
    return Object.keys(minPayoutAmounts).map((currency, index) => {
      return (
        <MenuItem value={currency} key={index}>
          {currency}
        </MenuItem>
      );
    });
  };

  if (ready) {
    return (
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <div className="inputContainer">
          <ReactHookFormSelect
            name="currency"
            label={t('labels.currency')}
            control={control}
            helperText={t('helperText.currency')}
            defaultValue={'Default'}
          >
            {renderCurrencyOptions()}
          </ReactHookFormSelect>
          <TextField
            label={t('labels.payoutMinAmount')}
            name="payoutMinAmount"
            placeholder={t('placeholders.payoutMinAmount')}
            inputRef={register({
              required: t('errors.payoutMinAmountRequired'),
            })}
            error={errors.payoutMinAmount !== undefined}
            helperText={
              errors.payoutMinAmount && errors.payoutMinAmount.message
            }
          ></TextField>
          <TextField
            label={t('labels.bankName')}
            name="bankName"
            inputRef={register({
              required: t('errors.bankNameRequired'),
            })}
            placeholder={t('placeholders.bankName')}
            error={errors.bankName !== undefined}
            helperText={errors.bankName && errors.bankName.message}
          ></TextField>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            label={t('labels.bankAddress')}
            name="bankAddress"
            placeholder={t('placeholders.bankAddress')}
            inputRef={register({
              required: t('errors.bankAddressRequired'),
            })}
            error={errors.bankAddress !== undefined}
            helperText={errors.bankAddress && errors.bankAddress.message}
          ></TextField>
          <TextField
            label={t('labels.holderName')}
            name="holderName"
            placeholder={t('placeholders.holderName')}
            inputRef={register({
              required: t('errors.holderNameRequired'),
            })}
            error={errors.holderName !== undefined}
            helperText={errors.holderName && errors.holderName.message}
          ></TextField>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            label={t('labels.holderAddress')}
            name="holderAddress"
            placeholder={t('placeholders.holderAddress')}
            inputRef={register({
              required: t('errors.holderAddressRequired'),
            })}
            error={errors.holderAddress !== undefined}
            helperText={errors.holderAddress && errors.holderAddress.message}
          ></TextField>
          <InlineFormGroup>
            <TextField
              label={t('labels.accountNumber')}
              name="accountNumber"
              inputRef={register({
                required: t('errors.accountNumberRequired'),
              })}
              error={errors.accountNumber !== undefined}
              helperText={errors.accountNumber && errors.accountNumber.message}
            ></TextField>
            <TextField
              label={t('labels.routingNumber')}
              name="routingNumber"
              inputRef={register}
            ></TextField>
          </InlineFormGroup>
          <InlineFormGroup>
            <TextField
              label={t('labels.bic')}
              name="bic"
              inputRef={register({
                required: t('errors.bicRequired'),
              })}
              error={errors.bic !== undefined}
              helperText={errors.bic && errors.bic.message}
            ></TextField>
            <TextField
              label={t('labels.branchCode')}
              name="branchCode"
              inputRef={register}
            ></TextField>
          </InlineFormGroup>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            label={t('labels.remarks')}
            name="remarks"
            placeholder={t('placeholders.remarks')}
            helperText={t('helperText.remarks')}
            inputRef={register}
          ></TextField>
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          type="submit"
        >
          {t('saveButton')}
        </Button>
      </StyledForm>
    );
  }

  return null;
};

export default BankDetailsForm;
