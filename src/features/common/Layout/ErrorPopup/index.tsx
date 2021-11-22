import React, { ReactElement } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './ErrorPopup.module.scss';
import i18next from '../../../../../i18n';
import { ErrorHandlingContext } from '../ErrorHandlingContext';

const { useTranslation } = i18next;
export default function ErrorPopup(): ReactElement {
  const { t, ready } = useTranslation(['leaderboard']);
  const { error, setError } = React.useContext(ErrorHandlingContext);

  //   const sendUserToLogin = () => {
  //     loginWithRedirect({
  //       redirectUri: `${process.env.NEXTAUTH_URL}/login`,
  //       ui_locales: localStorage.getItem('language') || 'en',
  //     });
  //   };

  const getErrorColor = (errorType: string): string => {
    switch (errorType) {
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#f44336';
    }
  }

  return (
    <>
      {ready && error ? (
        <div className={styles.errorContainer}>
          <button
            id={'errorCloseButton'}
            className={`${styles.closeButton}`}
            onClick={() => setError(null)}
          >
            <CloseIcon color={getErrorColor(error.type)} />
          </button>
          <div className={styles.errorContent}>{error.message}</div>
        </div>
      ) : null}
    </>
  );
}
