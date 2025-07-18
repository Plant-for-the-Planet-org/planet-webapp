import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import getLocalizedPath from '../../../../utils/localizedPath';

const ImpersonationActivated = () => {
  const { user, isImpersonationModeOn, setIsImpersonationModeOn, loadUser } =
    useUserProps();
  const locale = useLocale();

  const router = useRouter();

  const exitImpersonation = () => {
    setIsImpersonationModeOn(false);
    localStorage.removeItem('impersonationData');
    router.push(getLocalizedPath(`/profile/impersonate-user`, locale));
    loadUser();
  };

  const t = useTranslations('Me');

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
