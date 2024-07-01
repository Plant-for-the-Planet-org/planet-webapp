import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { getAccountInfo } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import StyledForm from '../../../common/Layout/StyledForm';
import { useTenant } from '../../../common/Layout/TenantContext';
import styles from './ImpersonateUser.module.scss';
import { isEmailValid } from '../../../../utils/isEmailValid';

export type ImpersonationData = {
  targetEmail: string;
  supportPin: string;
};

const ImpersonateUserForm = (): ReactElement => {
  const router = useRouter();
  const { tenantConfig } = useTenant();
  const t = useTranslations('Me');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { token, setUser, setIsImpersonationModeOn } = useUserProps();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ImpersonationData>({
    mode: 'onBlur',
    defaultValues: {
      targetEmail: '',
      supportPin: '',
    },
  });

  const handleImpersonation = async (
    data: ImpersonationData
  ): Promise<void> => {
    if (data.targetEmail && data.supportPin) {
      setIsProcessing(true);
      try {
        const res = await getAccountInfo(tenantConfig?.id, token, data);
        const resJson = await res.json();
        if (res.status === 200) {
          setIsInvalidEmail(false);
          setIsImpersonationModeOn(true);
          const impersonationData: ImpersonationData = {
            targetEmail: resJson.email,
            supportPin: resJson.supportPin,
          };

          localStorage.setItem(
            'impersonationData',
            JSON.stringify(impersonationData)
          );
          setUser(resJson);
          router.push('/profile');
        } else {
          setIsInvalidEmail(true);
          setIsProcessing(false);
        }
      } catch (err) {
        console.log(err);
        setIsProcessing(false);
      }
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(handleImpersonation)}>
      <div className="inputContainer">
        <Controller
          name="targetEmail"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('enterTheEmail'),
            },
            validate: {
              emailInvalid: (value) =>
                value.length === 0 || isEmailValid(value) || t('invalidEmail'),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('profileEmail')}
              placeholder="xyz@email.com"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.targetEmail !== undefined || isInvalidEmail}
              helperText={
                (errors.targetEmail !== undefined &&
                  errors.targetEmail.message) ||
                (isInvalidEmail && t('wrongEntered'))
              }
            />
          )}
        />
        <Controller
          name="supportPin"
          control={control}
          rules={{
            required: t('enterSupportPin'),
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('supportPin')}
              placeholder={t('alphaNumeric')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.supportPin !== undefined || isInvalidEmail}
              helperText={
                (errors.supportPin !== undefined &&
                  errors.supportPin.message) ||
                (isInvalidEmail && t('wrongEntered'))
              }
            />
          )}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="formButton"
        disabled={isProcessing}
      >
        {isProcessing ? <div className={styles.spinner}></div> : t('switch')}
      </Button>
    </StyledForm>
  );
};

export default ImpersonateUserForm;
