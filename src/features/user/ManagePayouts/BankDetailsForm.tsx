import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, styled } from '@mui/material';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';

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

const BankDetailsForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('me');
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  if (ready) {
    return (
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <div className="inputContainer">
          <TextField
            label={t('managePayouts.labelBankName')}
            name="bankName"
            inputRef={register({
              required: t('managePayouts.errors.bankNameRequired'),
            })}
            error={errors.bankName !== undefined}
            helperText={errors.bankName && errors.bankName.message}
          ></TextField>
          <TextField
            multiline
            maxRows={4}
            label={t('managePayouts.labelBankAddress')}
            name="bankAddress"
            inputRef={register({
              required: t('managePayouts.errors.bankAddressRequired'),
            })}
            error={errors.bankAddress !== undefined}
            helperText={errors.bankAddress && errors.bankAddress.message}
          ></TextField>
          <TextField
            label={t('managePayouts.labelHolderName')}
            name="holderName"
            inputRef={register({
              required: t('managePayouts.errors.holderNameRequired'),
            })}
            error={errors.holderName !== undefined}
            helperText={errors.holderName && errors.holderName.message}
          ></TextField>
          <TextField
            multiline
            maxRows={4}
            label={t('managePayouts.labelHolderAddress')}
            name="holderAddress"
            inputRef={register({
              required: t('managePayouts.errors.holderAddressRequired'),
            })}
            error={errors.holderAddress !== undefined}
            helperText={errors.holderAddress && errors.holderAddress.message}
          ></TextField>
          <InlineFormGroup>
            <TextField
              label={t('managePayouts.labelAccountNumber')}
              name="accountNumber"
              inputRef={register({
                required: t('managePayouts.errors.accountNumberRequired'),
              })}
              error={errors.accountNumber !== undefined}
              helperText={errors.accountNumber && errors.accountNumber.message}
            ></TextField>
            <TextField
              label={t('managePayouts.labelRoutingNumber')}
              name="routingNumber"
              inputRef={register}
            ></TextField>
          </InlineFormGroup>
          <InlineFormGroup>
            <TextField
              label={t('managePayouts.labelBic')}
              name="bic"
              inputRef={register({
                required: t('managePayouts.errors.bicRequired'),
              })}
              error={errors.bic !== undefined}
              helperText={errors.bic && errors.bic.message}
            ></TextField>
            <TextField
              label={t('managePayouts.labelBranchCode')}
              name="branchCode"
              inputRef={register}
            ></TextField>
          </InlineFormGroup>
          <TextField
            multiline
            maxRows={4}
            label={t('managePayouts.labelRemarks')}
            name="remarks"
            inputRef={register}
          ></TextField>
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          type="submit"
        >
          Continue
          {/* TODOO - update button text and add to translation file */}
        </Button>
      </StyledForm>
    );
  }

  return null;
};

export default BankDetailsForm;
