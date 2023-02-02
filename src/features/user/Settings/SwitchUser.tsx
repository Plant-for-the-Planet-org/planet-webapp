import { useTranslation } from 'next-i18next';
import styles from './SwitchUser.module.scss';
import { SwitchUserContainer } from '../../common/Layout/SwitchUserContainer';
import { TextField, Button } from '@mui/material';

const SwitchUser = () => {
  const { t } = useTranslation('me');
  return (
    <div className={styles.switchUserContainer}>
      <p className="profilePageTitle">{t('me:switchUser')}</p>
      <p>{t('me:switchUserMessage')}</p>
      <SwitchUserContainer>
        <div style={{ marginTop: '11px' }}>
          <TextField
            id="outlined-search"
            name="targetEmail"
            label={t('me:profileEmail')}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="button"
            className="switchButton"
          >
            {t('me:switch')}
          </Button>
        </div>
      </SwitchUserContainer>
    </div>
  );
};

export default SwitchUser;
