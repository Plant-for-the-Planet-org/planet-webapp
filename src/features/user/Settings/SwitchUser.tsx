import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import styles from './SwitchUser.module.scss';
import { SwitchUserContainer } from '../../common/Layout/SwitchUserContainer';
import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';

const SwitchUser = () => {
  const { t } = useTranslation('me');
  const [targetEmail, setTargetEmail] = useState('');

  const { register, errors, handleSubmit } = useForm({
    mode: 'onSubmit',
  });

  const handle = () => {
    if (targetEmail) {
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
                })}
                name="targetEmail"
                label={t('me:profileEmail')}
                placeholder="xyz@email.com"
              />
            </div>
            {errors.targetEmail && (
              <span className={styles.emailErrors}>
                {errors.targetEmail.message}
              </span>
            )}
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
