import { useTranslation } from 'next-i18next';
import styles from './SwitchUser.module.scss';
import { SwitchUserContainer } from '../../common/Layout/SwitchUserContainer';
import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useContext } from 'react';

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
    <>
      <div className={styles.switchUserContainer}>
        <p className="profilePageTitle">{t('me:switchUser')}</p>
        <p>{t('me:switchUserMessage')}</p>
        <form onSubmit={handleSubmit(handle)}>
          <SwitchUserContainer>
            <div className={styles.fieldContainer}>
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
            </div>

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
          </SwitchUserContainer>
        </form>
      </div>
    </>
  );
};

export default SwitchUser;
