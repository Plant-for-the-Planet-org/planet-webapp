import React, { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import UnderMaintenanceImage from '../../../../../public/assets/images/icons/UnderMaintenance';
import styles from './UnderMaintenance.module.scss';

export default function UnderMaintenance(): ReactElement {
  const t = useTranslations('Common');
  return (
    <div className={styles.underMaintenance}>
      <UnderMaintenanceImage />
      <div className={styles.title}>{t('underMaintenance')}</div>
      {/* <div className={styles.note}>{t('underMaintenance')}</div> */}
    </div>
  );
}
