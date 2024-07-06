import { ReactElement, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, MenuItem, CircularProgress } from '@mui/material';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import StyledForm from '../../../common/Layout/StyledForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import CustomSnackbar from '../../../common/CustomSnackbar';
import { PaymentFrequencies } from '../../../../utils/constants/payoutConstants';
import { handleError, APIError, User } from '@planet-sdk/common';
import { useTenant } from '../../../common/Layout/TenantContext';

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
  const t = useTranslations('ManagePayouts');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { token, user, setUser, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
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
        tenantConfig?.id,
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

  if (user?.type === 'tpo') {
    return (
      <CenteredContainer>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <p>{t('payoutInformation1')}</p>
          <p>{t('payoutInformation2')}</p>
          <p>{t('payoutInformation3')}</p>
          <p>
            {t.rich('supportInformation', {
              supportLink: (chunks) => (
                <a
                  className="planet-links"
                  href="mailto:support@plant-for-the-planet.org"
                >
                  {chunks}
                </a>
              ),
            })}
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
