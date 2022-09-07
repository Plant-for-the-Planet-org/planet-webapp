import { ReactElement, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, MenuItem } from '@mui/material';
import ReactHookFormSelect from './ReactHookFormSelect';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { User } from '../../common/types/user';

const { useTranslation, Trans } = i18n;

const paymentFrequencies = [
  'manual',
  'monthly',
  'quarterly',
  'semiannually',
  'annually',
];

type FormData = {
  scheduleFrequency: string;
};

const PayoutScheduleForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');
  const { token, user, setUser } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const { handleSubmit, errors, control } = useForm<FormData>({
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const renderPaymentFrequencyOptions = () => {
    return paymentFrequencies.map((frequency, index) => {
      return (
        <MenuItem value={frequency} key={index}>
          {t(`scheduleFrequencies.${frequency}`)}
        </MenuItem>
      );
    });
  };

  if (ready) {
    return (
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <p>{t('payoutInformation1')}</p>
        <p>{t('payoutInformation2')}</p>
        <p>{t('payoutInformation3')}</p>
        <p>
          <Trans i18nKey="managePayouts:supportInformation">
            If you have an exceptional case, please contact{' '}
            <a
              className="planet-links"
              href="mailto:support@plant-for-the-planet.org"
            >
              support@plant-for-the-planet.org
            </a>
            .
          </Trans>
        </p>
        <div className="inputContainer">
          <ReactHookFormSelect
            name="scheduleFrequency"
            label={t('labels.scheduleFrequency')}
            control={control}
            defaultValue={user.scheduleFrequency}
            rules={{
              required: t('errors.scheduleFrequencyRequired'),
            }}
            error={errors.scheduleFrequency !== undefined}
            helperText={
              errors.scheduleFrequency && errors.scheduleFrequency.message
            }
          >
            {renderPaymentFrequencyOptions()}
          </ReactHookFormSelect>
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

export default PayoutScheduleForm;
