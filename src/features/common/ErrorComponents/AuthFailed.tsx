import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import WebappButton from '../WebappButton';
import { useAuthSession } from '../../../hooks/useAuthSession';
import styles from './AuthFailed.module.scss';

const SUPPORT_EMAIL = 'support@plant-for-the-planet.org';
const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  'Sign in failed'
)}`;

/**
 * Terminal screen shown when the auth redirect guard gives up, so the user gets an explanation and a way out instead of a loader that never resolves.
 *
 * Both actions log the user out, which clears the unusable session and the redirect counter so the next attempt starts clean.
 */
export default function AuthFailed() {
  const t = useTranslations('Common');
  const { logoutUser } = useAuthSession();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The content swaps without a navigation, which assistive tech does not announce. Focusing the heading puts the reader at the start of the new content.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
        {t('authFailedTitle')}
      </h1>

      <p className={styles.message}>
        {t.rich('authFailedMessage', {
          supportLink: (chunks) => <a href={SUPPORT_MAILTO}>{chunks}</a>,
        })}
      </p>

      <div className={styles.actions}>
        <WebappButton
          text={t('goToHomePage')}
          variant="primary"
          elementType="button"
          onClick={() => logoutUser(`${window.location.origin}/`)}
        />
        <WebappButton
          text={t('trySigningInAgain')}
          variant="secondary"
          elementType="button"
          onClick={() => logoutUser(`${window.location.origin}/login`)}
        />
      </div>
    </div>
  );
}
