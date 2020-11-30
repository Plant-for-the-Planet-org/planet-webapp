import React from 'react';
import styles from './NetworkFailure.module.scss';
import Wifi from '../../../../public/assets/images/icons/Wifi';
import CloseIcon from '../../../../public/assets/images/icons/CloseIcon';
import i18next from '../../../../i18n';

export default function NetworkFailure({ refresh, handleNetwork }) {
  const { useTranslation } = i18next;
  const { t, ready } = useTranslation(['common']);
  const handleClick = () => {
    // refresh();
    window.location.reload();
  };
  return (
        <div className={styles.networkContainer}>
            <div style={{ padding: '10px 5px' }}>
            <Wifi />

            </div>
              <p style={{ padding: '10px 5px' }}>{t('common:offlineMessage')}</p>
            <p
              className={styles.refresh}
              onClick={handleClick}
            >
              {t('common:refresh')}
            </p>
            <div
              className={styles.closeButton}
              onClick={handleNetwork}
            >
                <CloseIcon width="15px" color="grey" />
            </div>
        </div>
  );
}
