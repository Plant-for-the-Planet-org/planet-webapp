import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import LogoutIcon from '../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './SwitchUser.module.scss';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import { useContext } from 'react';

const ImpersonationActivated = () => {
  const { setEmail, email, alertError, setAlertError } =
    useContext(ParamsContext);

  const closeAlert = () => {
    localStorage.removeItem('targetEmail');
    setEmail('');
  };
  useEffect(() => {
    setAlertError('');
  }, [email]);
  const { t } = useTranslation('me');

  return (
    <div className={styles.impersonationAlertContainer}>
      {alertError ? (
        <div>{t('me:userNotexist')}</div>
      ) : (
        <>
          <div>{t('me:targetUser')}</div>
          <div>{email && `<${email}>`}</div>
        </>
      )}

      <div className={styles.logoutContainer}>
        <button onClick={() => closeAlert()}>
          <LogoutIcon />
        </button>
      </div>
      <div className={styles.exit}>{t('me:exitImpersonation')}</div>
    </div>
  );
};

export default ImpersonationActivated;
