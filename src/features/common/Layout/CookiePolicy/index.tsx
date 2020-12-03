import React, { useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './CookiePolicy.module.scss';
import i18next from '../../../../../i18n';

export default function CookiePolicy() {
  const [showCookieNotice, setShowCookieNotice] = useState(true);
  const { useTranslation } = i18next;
  const { t, ready } = useTranslation(['leaderboard']);
  const [session, loading] = useSession();
  
  React.useEffect(() => {
    let prev = localStorage.getItem('cookieNotice');
    if (prev === 'false') {
      setShowCookieNotice(false);
    }
    localStorage.setItem('cookieNotice', showCookieNotice.toString());
  }, [showCookieNotice]);
  
  React.useEffect(() => {
     if (!loading && session) {
       setShowCookieNotice(false);
     }
   }, [loading, session]);

  return showCookieNotice ? (
    <div className={styles.cookieContainer}>
      <div
        className={styles.closeButton}
        onClick={() => setShowCookieNotice(false)}
      >
        <CloseIcon color={styles.primaryColor} />
      </div>
      {ready ? (
        <div className={styles.cookieContent}>
          {t('common:privacyPolicyNotice')}{' '}
          <a href="https://www.plant-for-the-planet.org/en/footermenu/privacy-policy">
            {t('common:privacyPolicy')}
          </a>
        </div>
      ) : null}
    </div>
  ) : null;
}
