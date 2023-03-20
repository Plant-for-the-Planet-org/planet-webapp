import React from 'react';
import { useTranslation } from 'next-i18next';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const ImpersonationActivated = () => {
  const {
    user,
    isImpersonationModeOn,
    setImpersonatedEmail,
    setIsImpersonationModeOn,
  } = useContext(UserPropsContext);

  const { push } = useRouter();

  const exitImpersonation = () => {
    setImpersonatedEmail('');
    setIsImpersonationModeOn(false);
    localStorage.removeItem('impersonatedEmail');
    push(`/profile/impersonate-user`);
  };

  const { t } = useTranslation('me');

  return isImpersonationModeOn ? (
    <div className={styles.impersonationAlertContainer}>
      <div className={styles.impersonatingText}>
        {t('me:targetUser', { impersonatedEmail: `<${user.email}>` })}
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
