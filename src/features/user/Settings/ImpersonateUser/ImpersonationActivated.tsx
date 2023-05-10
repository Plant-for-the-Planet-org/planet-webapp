import React from 'react';
import { useTranslation } from 'next-i18next';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';

const ImpersonationActivated = () => {
  const { user, isImpersonationModeOn, setIsImpersonationModeOn, loadUser } =
    useUserProps();

  const { push } = useRouter();

  const exitImpersonation = () => {
    setIsImpersonationModeOn(false);
    localStorage.removeItem('impersonationData');
    push(`/profile/impersonate-user`);
    loadUser();
  };

  const { t } = useTranslation('me');

  return user && isImpersonationModeOn ? (
    <div className={styles.impersonationAlertContainer}>
      <div className={styles.impersonatingText}>
        {t('me:targetUser', { impersonatedEmail: `<${user?.email}>` })}
      </div>

      <div
        onClick={exitImpersonation}
        className={styles.exitImpersoantionContainer}
      >
        <div>
          <LogoutIcon />
        </div>
        <div className={styles.exit}>{t('me:exitImpersonation')}</div>
      </div>
    </div>
  ) : null;
};

export default ImpersonationActivated;
