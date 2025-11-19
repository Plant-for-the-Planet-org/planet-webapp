import type { ReactElement } from 'react';

import { useContext, useEffect } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './ErrorPopup.module.scss';
import { useTranslations } from 'next-intl';
import { ErrorHandlingContext } from '../ErrorHandlingContext';

export default function ErrorPopup(): ReactElement {
  const t = useTranslations('Common');
  const { errors, setErrors } = useContext(ErrorHandlingContext);

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

  const processErrorMessage = (errorMessage: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const translatedError = t(errorMessage);
    if (translatedError.startsWith('Common.')) {
      return errorMessage;
    } else {
      return translatedError;
    }
  };

  return (
    <>
      {errors &&
        errors.length > 0 &&
        errors.map((err, index) => {
          return (
            <div key={`${index}`} className={styles.errorContainer}>
              <button
                id={'errorCloseButton'}
                className={styles.closeButton}
                onClick={() => handleRemoveError(err.message)}
              >
                <CloseIcon color={'#f44336'} width={'10'} height={'10'} />
              </button>
              <div className={styles.errorContent}>
                {processErrorMessage(err.message)}
              </div>
            </div>
          );
        })}
    </>
  );
}
