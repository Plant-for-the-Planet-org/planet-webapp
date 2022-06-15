import React, { useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './CookiePolicy.module.scss';
import i18next from '../../../../../i18n';
import { UserPropsContext } from '../UserPropsContext';

const { useTranslation } = i18next;
export default function CookiePolicy() {
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const { t, ready } = useTranslation(['leaderboard']);
  const { user, contextLoaded, loginWithRedirect } = React.useContext(
    UserPropsContext
  );

  React.useEffect(() => {
    if (contextLoaded && user) {
      setShowCookieNotice(false);
    }
  }, [contextLoaded, user]);

  React.useEffect(() => {
    const prev = localStorage.getItem('cookieNotice');
    if (!prev) {
      setShowCookieNotice(true);
    } else {
      setShowCookieNotice(prev === 'true');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('cookieNotice', showCookieNotice);
  }, [showCookieNotice]);

  return ready && showCookieNotice ? (
    <div className={styles.cookieContainer}>
      <button
        id={'cookieCloseButton'}
        className={styles.closeButton}
        onClick={() => setShowCookieNotice(false)}
      >
        <CloseIcon color={styles.primaryColor} />
      </button>
      <div className={styles.cookieContent}>
        {t('common:privacyPolicyNotice')}{' '}
        <a href="https://www.plant-for-the-planet.org/en/footermenu/privacy-policy">
          {t('common:privacyPolicy')}
        </a>
      </div>
    </div>
  ) : null;
}
