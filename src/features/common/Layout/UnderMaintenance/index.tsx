import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import UnderMaintenanceImage from '../../../../../public/assets/images/icons/UnderMaintenance';
import styles from './UnderMaintenance.module.scss';

interface Props {}

export default function UnderMaintenance({}: Props): ReactElement {
  const { t } = useTranslation('common');
  return (
    <div className={styles.underMaintenance}>
      <UnderMaintenanceImage />
      <div className={styles.title}>{t('underMaintenance')}</div>
      {/* <div className={styles.note}>{t('underMaintenance')}</div> */}
    </div>
  );
}
