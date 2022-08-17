import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Button, MenuItem, TextField } from '@mui/material';
import ReactHookFormSelect from './ReactHookFormSelect';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';

const { useTranslation, Trans } = i18n;

type FormData = {
  payoutMinAmount: string;
  scheduleFrequency: string;
};

const PayoutScheduleForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('me');
  const { register, handleSubmit, errors, control } = useForm<FormData>({
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  if (ready) {
    return (
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
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
          <ReactHookFormSelect
            name="scheduleFrequency"
            label={t('managePayouts.labelScheduleFrequency')}
            control={control}
            defaultValue="annual"
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
          </ReactHookFormSelect>
          <TextField
            label={t('managePayouts.labelPayoutMinAmount')}
            name="payoutMinAmount"
            inputRef={register({
              required: t('managePayouts.errors.payoutMinAmountRequired'),
            })}
            error={errors.payoutMinAmount !== undefined}
            helperText={
              errors.payoutMinAmount && errors.payoutMinAmount.message
            }
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

export default PayoutScheduleForm;
