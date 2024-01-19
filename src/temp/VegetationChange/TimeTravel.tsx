import React from 'react';
import styles from './VegetationChange.module.scss';
import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';
import { useTranslation } from 'next-i18next';

const TimeTravel = ({ color, background }) => {
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
      <SatelliteIcon color={color} /> <p>{t('maps:timeTravel')}</p>
    </div>
  );
};

export default TimeTravel;
