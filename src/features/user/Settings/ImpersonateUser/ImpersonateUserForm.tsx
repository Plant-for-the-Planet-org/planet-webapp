import { ReactElement, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { getAccountInfo } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import StyledForm from '../../../common/Layout/StyledForm';

export type FormData = {
  targetEmail: string;
  supportPin: string;
};

const ImpersonateUserForm = (): ReactElement => {
  const router = useRouter();
  const { t } = useTranslation('me');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const { token, setUser, setIsImpersonationModeOn, setImpersonatedEmail } =
    useContext(UserPropsContext);
  const { register, errors, handleSubmit } = useForm<FormData>({
    mode: 'onSubmit',
  });

  const handleImpersonation = async (data: FormData): Promise<void> => {
    if (data.targetEmail) {
      try {
        const res = await getAccountInfo(token, data.targetEmail);
        const resJson = await res.json();
        if (res.status === 200) {
          setIsInvalidEmail(false);
          setIsImpersonationModeOn(true);
          setImpersonatedEmail(resJson.email);
          localStorage.setItem('impersonatedEmail', resJson.email);
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
        <TextField
          inputRef={register({
            required: {
              value: true,
              message: t('me:enterTheEmail'),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('me:invalidEmail'),
            },
          })}
          name="targetEmail"
          label={t('me:profileEmail')}
          placeholder="xyz@email.com"
          error={errors.targetEmail !== undefined || isInvalidEmail}
          helperText={
            (errors.targetEmail && errors.targetEmail.message) ||
            (isInvalidEmail && t('me:userNotexist'))
          }
        />
      </div>
      <TextField
        inputRef={register({
          required: {
            value: true,
            message: t('me:enterSupportPin'),
          },
        })}
        name="supportPin"
        label={t('me:supportPin')}
        placeholder="E.g p348"
        error={errors.supportPin}
        helperText={errors.supportPin && errors.supportPin.message}
      />
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
