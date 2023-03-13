import { useTranslation } from 'next-i18next';
import { SwitchUserContainer } from '../../common/Layout/SwitchUserContainer';
import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ReactElement, useContext, useState } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { useRouter } from 'next/router';

export type FormData = {
  targetEmail: string;
};

const SwitchUser = (): ReactElement => {
  const { t } = useTranslation('me');
  const { push } = useRouter();
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const { register, errors, handleSubmit } = useForm<FormData>({
    mode: 'onSubmit',
  });

  const { token, setUser, setIsImpersonationModeOn, setImpersonatedEmail } =
    useContext(UserPropsContext);

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
          push('/profile');
        } else {
          console.log(resJson);
          setIsInvalidEmail(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <DashboardView
      title={t('me:switchUser')}
      subtitle={t('me:switchUserMessage')}
    >
      <SwitchUserContainer>
        <form onSubmit={handleSubmit(handleImpersonation)}>
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
          />{' '}
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="switchButton"
            >
              {t('me:switch')}
            </Button>
          </div>
        </form>
      </SwitchUserContainer>
    </DashboardView>
  );
};

export default SwitchUser;
