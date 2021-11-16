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
  React.useEffect(() => {
    setError({
      type: 'error',
      message: 'Something went wrong!',
    });
    console.log(`object`);
  }, []);

  console.log(`error`, error);

  return (
    <>
      {ready && error ? (
        <div className={styles.errorContainer}>
          <button
            id={'errorCloseButton'}
            className={`${styles.closeButton} ${error.type}`}
            onClick={() => setError(null)}
          >
            <CloseIcon color={styles.primaryColor} />
          </button>
          <div className={styles.cookieContent}>{error.message}</div>
        </div>
      ) : null}
    </>
  );
}
