import React, { useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './RedeemPopup.module.scss';
import i18next from '../../../../../i18n/server';
import { useAuth0 } from '@auth0/auth0-react';

const { useTranslation } = i18next;
export default function RedeemPopup() {
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const { t, ready } = useTranslation(['leaderboard']);
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  const sendUserToLogin = () => {
    loginWithRedirect({ redirectUri: `${process.env.NEXTAUTH_URL}/login` });
  };

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowRedeemPopup(false);
    }
  }, [isAuthenticated, isLoading]);

  React.useEffect(() => {
    let prev = localStorage.getItem('redeemPopup');
    if (!prev) {
      setShowRedeemPopup(true);
    } else {
      setShowRedeemPopup(prev === 'true');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('redeemPopup', showRedeemPopup);
  }, [showRedeemPopup]);

  return ready && showRedeemPopup ? (
    <div className={styles.cookieContainer}>
      <div
        className={styles.closeButton}
        onClick={() => setShowRedeemPopup(false)}
      >
        <CloseIcon color={styles.primaryColor} />
      </div>
      <div className={styles.cookieContent}>
        {t('common:redeemPopup')}{' '}
        <a onClick={sendUserToLogin}>{t('common:login')}</a>
      </div>
    </div>
  ) : null;
}
