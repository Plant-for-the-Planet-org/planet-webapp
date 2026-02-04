// unused component
import { useEffect, useRef, useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './RedeemPopup.module.scss';
import { useTranslations } from 'next-intl';
import { useTenant } from '../TenantContext';
import themeProperties from '../../../../theme/themeProperties';
import { useAuthSession } from '../../../../hooks/useAuthSession';
import { useAuthStore, useUserStore } from '../../../../stores';

export default function RedeemPopup() {
  const t = useTranslations('Common');
  const { tenantConfig } = useTenant();
  const { loginWithRedirect } = useAuthSession();
  // local state
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  //store: state
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);

  const sendUserToLogin = () => {
    if (typeof window !== 'undefined') {
      loginWithRedirect({
        redirectUri: `${window.location.origin}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
  };

  useEffect(() => {
    if (isAuthResolved && userProfile) {
      setShowRedeemPopup(false);
    }
  }, [isAuthResolved && userProfile]);

  const isMountedRef = useRef(false);

  useEffect(() => {
    // Check if the component has already mounted before updating state
    if (isMountedRef.current) {
      return;
    }
    if (tenantConfig.config.showRedeemHint) {
      const prev = localStorage.getItem('redeemPopup');
      if (!prev) {
        setShowRedeemPopup(true);
      } else {
        setShowRedeemPopup(prev === 'true');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('redeemPopup', `${showRedeemPopup}`);
  }, [showRedeemPopup]);

  // useEffect to update the isMountedRef after the initial mount
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  return showRedeemPopup ? (
    <div className={styles.cookieContainer}>
      <button
        id={'redeemCloseButton'}
        className={styles.closeButton}
        onClick={() => setShowRedeemPopup(false)}
      >
        <CloseIcon color={themeProperties.designSystem.colors.primaryColor} />
      </button>
      <div className={styles.cookieContent}>
        {t('redeemPopup')} <a onClick={sendUserToLogin}>{t('login')}</a>
      </div>
    </div>
  ) : null;
}
