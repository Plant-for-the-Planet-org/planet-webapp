import React from 'react';
import { useTranslations } from 'next-intl';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';

const ImpersonationActivated = () => {
  const { user, isImpersonationModeOn, setIsImpersonationModeOn, loadUser } =
    useUserProps();

  const router = useRouter();

  const exitImpersonation = () => {
    setIsImpersonationModeOn(false);
    localStorage.removeItem('impersonationData');
    router.push(`/profile/impersonate-user`);
    loadUser();
  };

  const t = useTranslations('Me');

  return user && isImpersonationModeOn ? (
    <div className={styles.impersonationAlertContainer}>
      <div className={styles.impersonatingText}>
        {t('targetUser', { impersonatedEmail: `<${user?.email}>` })}
      </div>

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
