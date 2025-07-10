import styles from '../../../common/Layout/UserLayout/UserLayout.module.scss';
import { useTranslations } from 'next-intl';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useApi } from '../../../../hooks/useApi';

interface SupportPin {
  supportPin: string;
}

const SupportPin = () => {
  const { user, setUser } = useUserProps();
  if (!user) return null;
  const t = useTranslations('Me');
  const { putApiAuthenticated } = useApi();
  const handleNewPin = async () => {
    try {
      const response = await putApiAuthenticated<SupportPin>(
        '/app/profile/supportPin'
      );
      if (response) {
        const updateUserData = { ...user };
        updateUserData['supportPin'] = response.supportPin;
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
        <div className={styles.supportPin}>{t('supportPin')} :</div>
        <div className={styles.pinValue}>{user?.supportPin}</div>
        <div>
          <button className={styles.resetPinButton} onClick={handleNewPin}>
            <RestartAltIcon />
          </button>
        </div>
        <div className={styles.resetPin}>
          <span>{t('resetPin')}</span>
        </div>
      </div>
    </>
  );
};

export default SupportPin;
