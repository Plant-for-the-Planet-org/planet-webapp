import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { getAccountInfo } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import StyledForm from '../../../common/Layout/StyledForm';

export type ImpersonationData = {
  targetEmail: string;
  supportPin: string;
};

const ImpersonateUserForm = (): ReactElement => {
  const router = useRouter();
  const { t } = useTranslation('me');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
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
      try {
        const res = await getAccountInfo(token, data);
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
        }
      } catch (err) {
        console.log(err);
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
              message: t('me:enterTheEmail'),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('me:invalidEmail'),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('me:profileEmail')}
              placeholder="xyz@email.com"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.targetEmail !== undefined || isInvalidEmail}
              helperText={
                (errors.targetEmail !== undefined &&
                  errors.targetEmail.message) ||
                (isInvalidEmail && t('me:wrongEntered'))
              }
            />
          )}
        />
        <Controller
          name="supportPin"
          control={control}
          rules={{
            required: t('me:enterSupportPin'),
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('me:supportPin')}
              placeholder={t('me:alphaNumeric')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.supportPin !== undefined || isInvalidEmail}
              helperText={
                (errors.supportPin !== undefined &&
                  errors.supportPin.message) ||
                (isInvalidEmail && t('me:wrongEntered'))
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
      >
        {t('me:switch')}
      </Button>
    </StyledForm>
  );
};

export default ImpersonateUserForm;
