import React, { useState } from 'react';
import styles from './ProjectMapTabs.module.scss';
import SingleTab from './SingleTab';
import SatelliteAnalysisIcon from '../icons/SatelliteAnalysisIcon';
import { useTranslations } from 'next-intl';
import FieldDataIcon from '../icons/FieldDataIcon';
import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';

type SelectedMode = 'satellite' | 'field' | 'timeTravel';

interface TabsProps {
  selected: SelectedMode;
}

const Tabs = ({ selected }: TabsProps) => {
  const [selectedMode, setSelectedMode] = useState<SelectedMode>(selected);

  const allTabsList: SelectedMode[] = ['satellite', 'field', 'timeTravel'];
  const setSeparatorVisibility = (
    selectedMode: SelectedMode,
    separatorId: number
  ) => {
    const index = allTabsList.indexOf(selectedMode);
    if (separatorId !== index - 1 && separatorId !== index) return true;
    return false;
  };

  const tProjectDetails = useTranslations('ProjectDetails');
  const tMaps = useTranslations('Maps');

  return (
    <div className={styles.tabsContainer}>
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
        title={tProjectDetails('satelliteAnalysis')}
        isSelected={selectedMode === 'satellite'}
        onClickHandler={() => setSelectedMode('satellite')}
      />
      <div
        className={
          setSeparatorVisibility(selectedMode, 0)
            ? styles.showSeparator1
            : styles.hideSeparator
        }
      ></div>
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
        title={tMaps('fieldData')}
        isSelected={selectedMode === 'field'}
        onClickHandler={() => setSelectedMode('field')}
      />
      <div
        className={
          setSeparatorVisibility(selectedMode, 1)
            ? styles.showSeparator2
            : styles.hideSeparator
        }
      ></div>
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
        title={tMaps('timeTravel')}
        isSelected={selectedMode === 'timeTravel'}
        onClickHandler={() => setSelectedMode('timeTravel')}
      />
    </div>
  );
};

export default Tabs;
