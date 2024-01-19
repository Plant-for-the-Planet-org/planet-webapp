import { useTranslation } from 'next-i18next';
import React from 'react';
import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';
import styles from './ProjectViewTabs.module.scss';
import FieldDataIcon from '../icons/FieldDataIcon';

const FieldData = ({ color, background }) => {
  const { t } = useTranslation(['maps']);
  return (
    <div
      //   onClick={() => {
      //     setSelectedMode('imagery');
      //   }}
      style={{
        color: color,
        backgroundColor: background,
        border: 'none',
      }}
      className={`${styles.option} ${styles.compact}`}
    >
      <FieldDataIcon color={color} /> <p>{t('maps:fieldData')}</p>
    </div>
  );
};

export default FieldData;
