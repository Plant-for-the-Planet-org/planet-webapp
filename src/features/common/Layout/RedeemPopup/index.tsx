import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './RedeemPopup.module.scss';
import i18next from '../../../../../i18n';
import tenantConfig from '../../../../../tenant.config';

const { useTranslation } = i18next;
export default function RedeemPopup() {
  const { t, ready } = useTranslation(['leaderboard']);
  const config = tenantConfig();
  
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  const sendUserToLogin = () => {
    loginWithRedirect({ redirectUri: `${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
  };

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowRedeemPopup(false);
    }
  }, [isAuthenticated, isLoading]);

  React.useEffect(() => {
    if (config.showRedeemHint) {
      let prev = localStorage.getItem('redeemPopup');
      if (!prev) {
        setShowRedeemPopup(true);
      } else {
        setShowRedeemPopup(prev === 'true');
      }      
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('redeemPopup', showRedeemPopup);
  }, [showRedeemPopup]);

  return ready && showRedeemPopup ? (
    <div className={styles.cookieContainer}>
      <button id={'redeemCloseButton'}
        className={styles.closeButton}
        onClick={() => setShowRedeemPopup(false)}
      >
        <CloseIcon color={styles.primaryColor} />
      </button >
      <div className={styles.cookieContent}>
        {t('common:redeemPopup')}{' '}
        <a onClick={sendUserToLogin}>{t('common:login')}</a>
      </div>
    </div>
  ) : null;
}
