import { useEffect, useRef, useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './CookiePolicy.module.scss';
import { useUserProps } from '../UserPropsContext';
import { useLocale, useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';

export default function CookiePolicy() {
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const t = useTranslations('Common');
  const locale = useLocale();
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

  return showCookieNotice ? (
    <div className={styles.cookieContainer}>
      <button
        id={'cookieCloseButton'}
        className={styles.closeButton}
        onClick={() => setShowCookieNotice(false)}
      >
        <CloseIcon color={themeProperties.designSystem.colors.primaryColor} />
      </button>
      <div className={styles.cookieContent}>
        {t('privacyPolicyNotice')}{' '}
        <a href={`https://pp.eco/legal/${locale}/privacy`}>
          {t('privacyPolicy')}
        </a>
      </div>
    </div>
  ) : null;
}
