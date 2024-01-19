import React from 'react';
import LocationIcon from '../../../public/assets/images/icons/LocationIcon';
import { useTranslation } from 'next-i18next';
import styles from './VegetationChange.module.scss';
import SatelliteAnalysisIcon from '../icons/SatelliteAnalysisIcon';
const SatelliteAnalysis = ({ color, background }) => {
  const { t } = useTranslation(['maps']);
  return (
    <div>
      <div
        // onClick={() => {
        //   setSelectedMode('location');
        // }}
        style={{
          color: color,
          backgroundColor: background,
          border: 'none',
        }}
        className={`${styles.option} ${styles.compact}`}
      >
        <SatelliteAnalysisIcon color={color} /> <p>satellite</p>
      </div>
    </div>
  );
};

export default SatelliteAnalysis;
