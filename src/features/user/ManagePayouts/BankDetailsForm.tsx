import { Button, TextField, styled } from '@mui/material';
import { ReactElement } from 'react';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';

const { useTranslation } = i18n;

const InlineFormGroup = styled('div')({
  display: 'flex',
  columnGap: 16,
  rowGap: 24,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',

  '& .MuiTextField-root': {
    flex: 1,
    minWidth: 240,
  },
});

const BankDetailsForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('me');

  if (ready) {
    return (
      <StyledForm>
        <div className="inputContainer">
          <TextField label={t('managePayouts.labelBankName')}></TextField>
          <TextField
            multiline
            maxRows={4}
            label={t('managePayouts.labelBankAddress')}
          ></TextField>
          <TextField label={t('managePayouts.labelHolderName')}></TextField>
          <TextField
            multiline
            maxRows={4}
            label={t('managePayouts.labelHolderAddress')}
          ></TextField>
          <InlineFormGroup>
            <TextField
              label={t('managePayouts.labelAccountNumber')}
            ></TextField>
            <TextField
              label={t('managePayouts.labelRoutingNumber')}
            ></TextField>
          </InlineFormGroup>
          <InlineFormGroup>
            <TextField label={t('managePayouts.labelBic')}></TextField>
            <TextField label={t('managePayouts.labelBranchCode')}></TextField>
          </InlineFormGroup>
          <TextField
            multiline
            maxRows={4}
            label={t('managePayouts.labelRemarks')}
          ></TextField>
        </div>
        <Button variant="contained" color="primary" className="formButton">
          Continue
        </Button>
      </StyledForm>
    );
  }

  return null;
};

export default BankDetailsForm;
