import styles from '../../../common/Layout/UserLayout/UserLayout.module.scss';
import { useTranslation } from 'next-i18next';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface SupportPin {
  supportPin: string;
}

const SupportPin = () => {
  const { token, user, setUser } = useContext(UserPropsContext);
  const { t } = useTranslation('me');

  const handleNewPin = async () => {
    try {
      const response = await putAuthenticatedRequest<SupportPin>(
        '/app/profile/supportPin',
        undefined,
        token
      );
      if (response) {
        const updateUserData = { ...user };
        updateUserData['supportPin'] = response?.supportPin;
        setUser(updateUserData);
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.supportPinContainer}>
        <div className={styles.supportPin}>{t('me:supportPin')} :</div>
        <div className={styles.pinValue}>{user?.supportPin}</div>
        <div>
          <button onClick={handleNewPin}>
            <RestartAltIcon sx={{ '&:hover': { color: '#66BB6A' } }} />
          </button>
        </div>
        <div className={styles.resetPin}>
          <span>{t('me:resetPin')}</span>
        </div>
      </div>
    </>
  );
};

export default SupportPin;
