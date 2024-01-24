import React, { useState } from 'react';
import styles from './ProjectMapTabs.module.scss';
import SingleTab from './SingleTab';
import SatelliteAnalysisIcon from '../icons/SatelliteAnalysisIcon';
import { useTranslation } from 'next-i18next';
import FieldDataIcon from '../icons/FieldDataIcon';
import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';

const Tabs = ({ selected }) => {
  const [selectedMode, setSelectedMode] = useState(selected);

  const { t } = useTranslation(['maps']);
  return (
    <div className={styles.tabsContainer}>
      <div onClick={() => setSelectedMode('satellite')}>
        <SingleTab
          icon={
            <SatelliteAnalysisIcon
              color={selectedMode === 'satellite' ? '#fff' : '#000'}
            />
          }
          title={t('maps:satelliteAnalysis')}
          isSelected={selectedMode === 'satellite'}
        />
      </div>
      <div onClick={() => setSelectedMode('field')}>
        <SingleTab
          icon={
            <FieldDataIcon color={selectedMode === 'field' ? '#fff' : '#000'} />
          }
          title={t('maps:fieldData')}
          isSelected={selectedMode === 'field'}
        />
      </div>
      <div onClick={() => setSelectedMode('timeTravel')}>
        <SingleTab
          icon={
            <SatelliteIcon
              color={selectedMode === 'timeTravel' ? '#fff' : '#000'}
            />
          }
          title={t('maps:timeTravel')}
          isSelected={selectedMode === 'timeTravel'}
        />
      </div>
    </div>
  );
};

export default Tabs;
