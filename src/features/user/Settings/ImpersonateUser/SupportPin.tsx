import styles from '../../../common/Layout/UserLayout/UserLayout.module.scss';
import { useTranslations } from 'next-intl';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTenant } from '../../../common/Layout/TenantContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

interface SupportPin {
  supportPin: string;
}

const SupportPin = () => {
  const { token, user, setUser, logoutUser } = useUserProps();
  const t = useTranslations('Me');
  const { tenantConfig } = useTenant();
  const handleNewPin = async () => {
    try {
      const response = await putAuthenticatedRequest<SupportPin>(
        tenantConfig?.id,
        '/app/profile/supportPin',
        undefined,
        token,
        logoutUser
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
        <div className={styles.supportPin}>{t('supportPin')} :</div>
        <div className={styles.pinValue}>{user?.supportPin}</div>
        <div>
          <button onClick={handleNewPin}>
            <RestartAltIcon sx={{ '&:hover': { color: '#66BB6A' } }} />
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
