import React from 'react';
import { useTranslation } from 'next-i18next';
import LogoutIcon from '../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './SwitchUser.module.scss';

const ImpersonationActivated = () => {
  const { t } = useTranslation('me');
  const email = 'sunilsabat347@gmail.com';
  return (
    <div className={styles.impersonationAlertContainer}>
      <div>{t('me:targetUser')}</div>
      <div>{`<${email}>`}</div>
      <div className={styles.logoutContainer}>
        <button>
          <LogoutIcon />
        </button>
      </div>
      <div className={styles.exit}>{t('me:exitImpersonation')}</div>
    </div>
  );
};

export default ImpersonationActivated;
