import React from 'react';
import { useTranslation } from 'next-i18next';
import LogoutIcon from '../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './SwitchUser.module.scss';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const ImpersonationActivated = () => {
  const { setValidEmail, validEmail, setImpersonationEmail } =
    useContext(UserPropsContext);

  const { push } = useRouter();

  const closeAlert = () => {
    localStorage.removeItem('secondUser');
    setValidEmail('');
    setImpersonationEmail('');
    push(`/profile/impersonate-user`);
  };

  const { t } = useTranslation('me');

  return (
    validEmail && (
      <div className={styles.impersonationAlertContainer}>
        <p className={styles.impersonatingText}>{t('me:targetUser')}</p>
        <p className={styles.impersonatingEmail}>{`<${validEmail}>`}</p>
        <div
          onClick={() => closeAlert()}
          className={styles.exitImpersoantionContainer}
        >
          <div>
            <LogoutIcon />
          </div>
          <div className={styles.exit}>{t('me:exitImpersonation')}</div>
        </div>
      </div>
    )
  );
};

export default ImpersonationActivated;
