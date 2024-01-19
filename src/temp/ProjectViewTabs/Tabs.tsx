import React, { useState } from 'react';
import styles from './ProjectViewTabs.module.scss';
import TimeTravel from './TimeTravel';
import SatelliteAnalysis from './SatelliteAnalysis';
import FieldData from './FieldData';

const Tabs = ({ selectedMode = 'timeTravel' }) => {
  //   const [selectedMode, setSelectedMode] = useState(null);
  //   const changeSelectedMode = (mode) => {
  //     setSelectedMode(mode);
  //   };
  return (
    <div className={styles.tabsContainer}>
      <SatelliteAnalysis
        color={selectedMode === 'satellite' ? '#fff' : '#000'}
        background={selectedMode === 'satellite' ? '#219653' : '#fff'}
      />
      <TimeTravel
        color={selectedMode === 'timeTravel' ? '#fff' : '#000'}
        background={selectedMode === 'timeTravel' ? '#219653' : '#fff'}
      />
      <FieldData
        color={selectedMode === 'field' ? '#fff' : '#000'}
        background={selectedMode === 'field' ? '#219653' : '#fff'}
      />
    </div>
  );
};

export default Tabs;
