import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import UnderMaintenanceImage from '../../../../../public/assets/images/icons/UnderMaintenance';
import styles from './UnderMaintenance.module.scss';

const { useTranslation } = i18next;

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
