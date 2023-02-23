import { useTranslation } from 'next-i18next';
import { SwitchUserContainer } from '../../common/Layout/SwitchUserContainer';
import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import DashboardView from '../../common/Layout/DashboardView';

export type FormData = {
  targetEmail: string;
};

const SwitchUser = () => {
  const { t } = useTranslation('me');

  const { register, errors, handleSubmit } = useForm<FormData>({
    mode: 'onSubmit',
  });
  const {
    targetEmail,
    setTargetEmail,
    setAlertError,
    alertError,
    setImpersonationEmail,
  } = useContext(UserPropsContext);

  const handle = (data: FormData): void => {
    setAlertError(false);
    if (data.targetEmail) {
      setImpersonationEmail(data.targetEmail);
      setTargetEmail('');
    }
  };

  return (
    <DashboardView
      title={t('me:switchUser')}
      subtitle={t('me:switchUserMessage')}
    >
      <SwitchUserContainer>
        <form onSubmit={handleSubmit(handle)}>
          <TextField
            onChange={(e) => setTargetEmail(e.target.value)}
            value={targetEmail}
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
            error={errors.targetEmail || alertError}
            helperText={
              (!alertError &&
                errors.targetEmail &&
                errors.targetEmail.message) ||
              (alertError && !targetEmail && t('me:userNotexist'))
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
