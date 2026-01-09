import type { FC, ReactNode } from 'react';

import { useWebGL } from '../../../hooks/useWebGL';
import styles from './WebGLGuard.module.scss';

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
  const { isWebglSupported, error, loading } = useWebGL();

  if (loading) {
    return (
      <div className={styles.loading}>
        {loadingComponent || (
          <div
            className={styles.spinner}
            aria-live="polite"
            aria-label="Loading map"
          >
            Loading map...
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

        <h3 className={styles.errorTitle}>Graphics acceleration required</h3>

        <p className={styles.errorMessage}>
          This map requires graphics acceleration to function properly. This
          feature may be disabled in your browser settings or unavailable in
          your current environment (such as remote desktop connections).
        </p>

        <div className={styles.solutionSteps}>
          <h4>To enable graphics acceleration:</h4>
          <ul>
            <li>
              <strong>Chrome:</strong> Settings → Advanced → System → Enable
              &quot;Use graphics acceleration when available&quot;
            </li>
            <li>
              <strong>Firefox:</strong> Settings → General → Performance →
              Uncheck &quot;Use recommended performance settings&quot;
            </li>
            <li>
              <strong>Edge:</strong> Settings → System → Enable &quot;Use
              hardware acceleration when available&quot;
            </li>
          </ul>
        </div>

        <div className={styles.contactInfo}>
          <p>
            If you continue to have issues, please contact us at
            support@plant-for-the-planet.org for assistance.
          </p>
        </div>

        {showDetailedError && error && (
          <details className={styles.technicalDetails}>
            <summary>Technical details</summary>
            <code>{error}</code>
          </details>
        )}
      </div>
    );
  }

  return children;
};

export default WebGLGuard;
