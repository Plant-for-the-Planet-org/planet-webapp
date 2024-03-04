import React, { useState } from 'react';
import styles from './ProjectMapTabs.module.scss';
import SingleTab from './SingleTab';
import SatelliteAnalysisIcon from '../icons/SatelliteAnalysisIcon';
import { useTranslation } from 'next-i18next';
import FieldDataIcon from '../icons/FieldDataIcon';
import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';

interface TabsProps {
  selected: string;
}

const Tabs = ({ selected }: TabsProps) => {
  const [selectedMode, setSelectedMode] = useState(selected);

  const allTabsList = ['satellite', 'field', 'timeTravel'];
  const setSeparatorVisibility = (
    selectedMode: string,
    separatorId: number
  ) => {
    const index = allTabsList.indexOf(selectedMode);
    if (separatorId !== index - 1 && separatorId !== index) return true;
    return false;
  };

  const { t } = useTranslation(['maps', 'projectDetails']);
  return (
    <div className={styles.tabsContainer}>
      <div onClick={() => setSelectedMode('satellite')}>
        <SingleTab
          icon={
            <SatelliteAnalysisIcon
              color={
                selectedMode === 'satellite'
                  ? `${'var(--light)'}`
                  : `${'var(--dark)'}`
              }
            />
          }
          title={t('projectDetails:satelliteAnalysis')}
          isSelected={selectedMode === 'satellite'}
        />
        <div
          className={
            setSeparatorVisibility(selectedMode, 0)
              ? styles.showSeparator1
              : styles.hideSeparator
          }
        ></div>
      </div>
      <div onClick={() => setSelectedMode('field')}>
        <SingleTab
          icon={
            <FieldDataIcon
              color={
                selectedMode === 'field'
                  ? `${'var(--light)'}`
                  : `${'var(--dark)'}`
              }
            />
          }
          title={t('maps:fieldData')}
          isSelected={selectedMode === 'field'}
        />
      </div>
      <div
        className={
          setSeparatorVisibility(selectedMode, 1)
            ? styles.showSeparator2
            : styles.hideSeparator
        }
      ></div>
      <div onClick={() => setSelectedMode('timeTravel')}>
        <SingleTab
          icon={
            <SatelliteIcon
              color={
                selectedMode === 'timeTravel'
                  ? `${'var(--light)'}`
                  : `${'var(--dark)'}`
              }
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
