import { useTranslations } from 'next-intl';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

const ImpersonationActivated = () => {
  const t = useTranslations('Me');
  const { user, isImpersonationModeOn, setIsImpersonationModeOn, loadUser } =
    useUserProps();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const exitImpersonation = () => {
    setIsImpersonationModeOn(false);
    localStorage.removeItem('impersonationData');
    router.push(localizedPath(`/profile/impersonate-user`));
    loadUser();
  };

  return user && isImpersonationModeOn ? (
    <div className={styles.impersonationAlertContainer}>
      <div>{t('targetUser', { impersonatedEmail: `<${user?.email}>` })}</div>

      <div
        onClick={exitImpersonation}
        className={styles.exitImpersonationContainer}
      >
        <div>
          <LogoutIcon />
        </div>
        <div className={styles.exit}>{t('exitImpersonation')}</div>
      </div>
    </div>
  ) : null;
};

export default ImpersonationActivated;
