import React, { ReactElement, useEffect } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './ErrorPopup.module.scss';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../ErrorHandlingContext';

export default function ErrorPopup(): ReactElement {
  const { t, ready } = useTranslation(['common']);
  const { errors, setErrors } = React.useContext(ErrorHandlingContext);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (errors) {
      timer = setTimeout(() => {
        setErrors(null);
      }, 10000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [errors]);

  const handleRemoveError = (message: string) => {
    if (errors) {
      const updatedErrors = errors.filter((err) => err.message !== message);
      if (updatedErrors.length === 0) {
        setErrors(null);
      } else {
        setErrors(updatedErrors);
      }
    }
  };

  return (
    <>
      {ready &&
        errors &&
        errors.length > 0 &&
        errors.map((err, index) => {
          return (
            <div key={`${index}`} className={styles.errorContainer}>
              <button
                id={'errorCloseButton'}
                className={`${styles.closeButton}`}
                onClick={() => handleRemoveError(err.message)}
              >
                <CloseIcon color={'#f44336'} width={'10'} height={'10'} />
              </button>
              <div className={styles.errorContent}>{t(err.message)}</div>
            </div>
          );
        })}
    </>
  );
}
