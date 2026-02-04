import styles from '../../../common/Layout/UserLayout/UserLayout.module.scss';
import { useTranslations } from 'next-intl';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useApi } from '../../../../hooks/useApi';
import { useUserStore } from '../../../../stores';

interface SupportPin {
  supportPin: string;
}

const SupportPin = () => {
  const userProfile = useUserStore((state) => state.userProfile);
  if (!userProfile) return null;
  // store: action
  const setUserProfile = useUserStore((state) => state.setUserProfile);
  const t = useTranslations('Me');
  const { putApiAuthenticated } = useApi();

  const handleNewPin = async () => {
    try {
      const response = await putApiAuthenticated<SupportPin>(
        '/app/profile/supportPin',
        { payload: {} }
      );
      if (response) {
        const updateUserData = { ...userProfile };
        updateUserData['supportPin'] = response.supportPin;
        setUserProfile(updateUserData);
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
        <div className={styles.pinValue}>{userProfile?.supportPin}</div>
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
