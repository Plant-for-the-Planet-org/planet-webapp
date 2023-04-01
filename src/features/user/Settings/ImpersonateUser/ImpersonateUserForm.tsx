import { ReactElement, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { getAccountInfo } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import StyledForm from '../../../common/Layout/StyledForm';

export type ImpersonationData = {
  targetEmail: string;
  supportPin: string;
};

const ImpersonateUserForm = (): ReactElement => {
  const router = useRouter();
  const { t } = useTranslation('me');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const { token, setUser, setIsImpersonationModeOn, setImpersonatedData } =
    useContext(UserPropsContext);
  const { register, errors, handleSubmit } = useForm<ImpersonationData>({
    mode: 'onSubmit',
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
          setImpersonatedData(impersonationData);
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
            (isInvalidEmail && t('me:wrongEntered'))
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
        placeholder={t('me:alphaNumeric')}
        error={errors.supportPin || isInvalidEmail}
        helperText={
          (errors.supportPin && errors.supportPin.message) ||
          (isInvalidEmail && t('me:wrongEntered'))
        }
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
