import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';
import { ReactElement, useState } from 'react';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';

const { useTranslation, Trans } = i18n;

const PayoutScheduleForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('me');
  const [scheduleFrequency, setScheduleFrequency] = useState('annual');
  const [payoutMinAmount, setPayoutMinAmount] = useState('');

  if (ready) {
    return (
      <StyledForm>
        <p>{t('managePayouts.payoutInformation1')}</p>
        <p>{t('managePayouts.payoutInformation2')}</p>
        <p>{t('managePayouts.payoutInformation3')}</p>
        <p>
          <Trans i18nKey="me:managePayouts.supportInformation">
            If you have an exceptional case, please contact{' '}
            <a href="mailto:support@plant-for-the-planet.org">
              support@plant-for-the-planet.org
            </a>
            .
          </Trans>
        </p>
        <div className="inputContainer">
          <FormControl>
            <InputLabel id="payment-frequency-label">
              {t('managePayouts.labelScheduleFrequency')}
            </InputLabel>
            <Select
              label={t('managePayouts.labelScheduleFrequency')}
              labelId="payment-frequency-label"
              id="payment-frequency"
              value={scheduleFrequency}
              onChange={(e) => setScheduleFrequency(e.target.value)}
            >
              <MenuItem value="monthly">
                {t('managePayouts.scheduleFrequencies.monthly')}
              </MenuItem>
              <MenuItem value="quarterly">
                {t('managePayouts.scheduleFrequencies.quarterly')}
              </MenuItem>
              <MenuItem value="semi-annual">
                {t('managePayouts.scheduleFrequencies.semi-annual')}
              </MenuItem>
              <MenuItem value="annual">
                {t('managePayouts.scheduleFrequencies.annual')}
              </MenuItem>
              <MenuItem value="manual">
                {t('managePayouts.scheduleFrequencies.manual')}
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={t('managePayouts.labelPayoutMinAmount')}
            value={payoutMinAmount}
            onChange={(e) => setPayoutMinAmount(e.target.value)}
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

export default PayoutScheduleForm;
