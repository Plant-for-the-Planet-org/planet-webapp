import React, { useState } from 'react';
import CloseIcon from '../../../assets/images/icons/CloseIcon';
import styles from './CookiePolicy.module.scss';

export default function CookiePolicy() {
  const [showCookieNotice, setShowCookieNotice] = useState(true);
  React.useEffect(() => {
    let prev = localStorage.getItem('cookieNotice');
    if (prev === 'false') {
      setShowCookieNotice(false);
    }
    localStorage.setItem('cookieNotice', showCookieNotice.toString());
  }, [showCookieNotice]);

  return showCookieNotice ? (
    <div className={styles.cookieContainer}>
      <div
        className={styles.closeButton}
        onClick={() => setShowCookieNotice(false)}
      >
        <CloseIcon color={styles.primaryColor} />
      </div>
      <div className={styles.cookieContent}>
        By using this website, you agree to our{' '}
        <a href="https://www.plant-for-the-planet.org/en/footermenu/privacy-policy">
          privacy policy
        </a>
      </div>
    </div>
  ) : null;
}
