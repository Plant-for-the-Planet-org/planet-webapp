import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styles from '../styles/CookiePolicy.module.scss';

export default function CookiePolicy() {
  const [showCookieNotice, setShowCookieNotice] = useState(true);
  return showCookieNotice ? (
    <div className={styles.cookieContainer}>
      <div
        className={styles.closeButton}
        onClick={() => setShowCookieNotice(false)}
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </div>
      <div className={styles.cookieContent}>
        By using this website, you agree to our <a href="#">cookie policy</a>
      </div>
    </div>
  ) : null;
}
