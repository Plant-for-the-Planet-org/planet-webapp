import type { FC, ReactNode } from 'react';

import { useWebGL } from '../../../hooks/useWebGL';
import styles from './WebGLGuard.module.scss';
import { useTranslations } from 'next-intl';

export interface WebGLGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  showDetailedError?: boolean;
}

const AlertIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2L1 21h22L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17h0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const WebGLGuard: FC<WebGLGuardProps> = ({
  children,
  fallback,
  loadingComponent,
  showDetailedError = false,
}) => {
  const t = useTranslations('Maps.mapFeatureSupport');
  const { isWebglSupported, error, loading } = useWebGL();

  if (loading) {
    return (
      <div className={styles.loading}>
        {loadingComponent || (
          <div
            className={styles.spinner}
            aria-live="polite"
            aria-label={t('loadingMap')}
          >
            {t('loadingMap')}
          </div>
        )}
      </div>
    );
  }

  if (!isWebglSupported) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className={styles.errorContainer} role="alert">
        <div className={styles.errorIcon}>
          <AlertIcon />
        </div>

        <h3 className={styles.errorTitle}>{t('notSupportedError.title')}</h3>

        <p className={styles.errorMessage}>{t('notSupportedError.message')}</p>

        <div className={styles.solutionSteps}>
          <h4>{t('notSupportedError.solutionTitle')}</h4>
          <ul>
            <li>
              {t.rich('notSupportedError.solutionChrome', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </li>
            <li>
              {t.rich('notSupportedError.solutionFirefox', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </li>
            <li>
              {t.rich('notSupportedError.solutionEdge', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </li>
          </ul>
        </div>

        <div className={styles.contactInfo}>
          <p>{t('notSupportedError.contactInfo')}</p>
        </div>

        {showDetailedError && error && (
          <details className={styles.technicalDetails}>
            <summary>{t('notSupportedError.technicalDetails')}</summary>
            <code>{error}</code>
          </details>
        )}
      </div>
    );
  }

  return children;
};

export default WebGLGuard;
