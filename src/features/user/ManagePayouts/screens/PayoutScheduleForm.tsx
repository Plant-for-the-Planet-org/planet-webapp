import { ReactElement, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, MenuItem, CircularProgress } from '@mui/material';
import ReactHookFormSelect from '../components/ReactHookFormSelect';
import StyledForm from '../../../common/Layout/StyledForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { useTranslation, Trans } from 'next-i18next';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import CustomSnackbar from '../../../common/CustomSnackbar';
import { PaymentFrequencies } from '../../../../utils/constants/payoutConstants';
import { handleError, APIError, User } from '@planet-sdk/common';

const paymentFrequencies = [
  PaymentFrequencies.MANUAL,
  PaymentFrequencies.MONTHLY,
  PaymentFrequencies.QUARTERLY,
  PaymentFrequencies.SEMIANNUAL,
  PaymentFrequencies.ANNUAL,
];

type FormData = {
  scheduleFrequency: PaymentFrequencies;
};

const PayoutScheduleForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { token, user, setUser, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsProcessing(true);

    try {
      const res = await putAuthenticatedRequest<User>(
        '/app/profile',
        { scheduleFrequency: data.scheduleFrequency },
        token,
        logoutUser
      );
      setUser(res);
      setIsSaved(true);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setErrors(handleError(err as APIError));
    }
  };

  const renderPaymentFrequencyOptions = (): ReactElement[] => {
    return paymentFrequencies.map((frequency, index) => {
      return (
        <MenuItem value={frequency} key={index}>
          {t(`scheduleFrequencies.${frequency}`)}
        </MenuItem>
      );
    });
  };

  const closeSnackbar = (): void => {
    setIsSaved(false);
  };

  if (ready && user?.type === 'tpo') {
    return (
      <CenteredContainer>
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
              label={t('labels.scheduleFrequency') + '*'}
              control={control}
              defaultValue={user.scheduleFrequency || PaymentFrequencies.MANUAL}
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
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress color="primary" size={24} />
            ) : (
              t('saveButton')
            )}
          </Button>
        </StyledForm>
        {isSaved && (
          <CustomSnackbar
            snackbarText={t('scheduleSaveSuccess')}
            isVisible={isSaved}
            handleClose={closeSnackbar}
          />
        )}
      </CenteredContainer>
    );
  }
  return null;
};

export default PayoutScheduleForm;
