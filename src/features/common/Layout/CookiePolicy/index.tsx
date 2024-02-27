import React, { useEffect, useRef, useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './CookiePolicy.module.scss';
import { useUserProps } from '../UserPropsContext';
import { useTranslation } from 'next-i18next';

export default function CookiePolicy() {
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const { i18n, t, ready } = useTranslation(['leaderboard']);
  const { user, contextLoaded } = useUserProps();

  useEffect(() => {
    if (contextLoaded && user) {
      setShowCookieNotice(false);
    }
  }, [contextLoaded, user]);

  const isMountedRef = useRef(false);

  useEffect(() => {
    // Check if the component has already mounted before updating state
    if (isMountedRef.current) {
      return;
    } else {
      const prev = localStorage.getItem('cookieNotice');
      if (!prev) {
        setShowCookieNotice(true);
      } else {
        setShowCookieNotice(prev === 'true');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cookieNotice', showCookieNotice);
  }, [showCookieNotice]);

  // useEffect to update the isMountedRef after the initial mount
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

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
        <a href={`https://pp.eco/legal/${i18n.language}/privacy`}>
          {t('common:privacyPolicy')}
        </a>
      </div>
    </div>
  ) : null;
}
