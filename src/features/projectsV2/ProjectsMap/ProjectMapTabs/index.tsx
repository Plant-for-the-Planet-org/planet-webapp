import type { ReactElement } from 'react';

import styles from './ProjectMapTabs.module.scss';
import SingleTab from './SingleTab';
// import SatelliteAnalysisIcon from '../../../../temp/icons/SatelliteAnalysisIcon';
import { useTranslations } from 'next-intl';
import FieldDataIcon from '../../../../../public/assets/images/icons/FieldDataIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';

export type SelectedTab = 'field' | 'timeTravel';

interface TabsProps {
  selectedTab: SelectedTab;
  setSelectedTab: (selectedTab: SelectedTab) => void;
  isTimeTravelEnabled: boolean;
}

const MapTabs = ({
  selectedTab,
  setSelectedTab,
  isTimeTravelEnabled,
}: TabsProps): ReactElement | null => {
  const availableTabs: SelectedTab[] = [
    'field',
    ...(isTimeTravelEnabled ? (['timeTravel'] as const) : []),
  ];

  // Code below will probably be used in the future, so don't remove it
  /* const allTabsList: SelectedTab[] = ['satellite', 'field', 'timeTravel']; */
  /* const setSeparatorVisibility = (
    selectedTab: SelectedTab,
    separatorId: number
  ) => {
    const index = allTabsList.indexOf(selectedTab);
    if (separatorId !== index - 1 && separatorId !== index) return true;
    return false;
  }; */

  const tMaps = useTranslations('Maps');

  if (availableTabs.length === 1) return null;

  return (
    <div className={styles.tabsContainer}>
      {/* Code below will be used in the future, don't remove it */}
      {/* <SingleTab
        icon={
          <SatelliteAnalysisIcon
            color={
              selectedTab === 'satellite'
                ? `${'var(--light)'}`
                : `${'var(--dark)'}`
            }
          />
        }
        title={tProjectDetails('satelliteAnalysis')}
        isSelected={selectedTab === 'satellite'}
        onClickHandler={() => setSelectedTab('satellite')}
      />
      <div
        className={
          setSeparatorVisibility(selectedTab, 0)
            ? styles.showSeparator1
            : styles.hideSeparator
        }
      ></div> */}
      <SingleTab
        icon={
          <FieldDataIcon
            color={
              selectedTab === 'field' ? `${'var(--light)'}` : `${'var(--dark)'}`
            }
          />
        }
        title={tMaps('fieldData')}
        isSelected={selectedTab === 'field'}
        onClickHandler={() => setSelectedTab('field')}
      />
      {/* Code below will be used in the future, don't remove it */}
      {/* <div
        className={
          setSeparatorVisibility(selectedTab, 1)
            ? styles.showSeparator2
            : styles.hideSeparator
        }
      ></div> */}
      {isTimeTravelEnabled && (
        <SingleTab
          icon={
            <SatelliteIcon
              color={
                selectedTab === 'timeTravel'
                  ? `${'var(--light)'}`
                  : `${'var(--dark)'}`
              }
            />
          }
          title={tMaps('timeTravel')}
          isSelected={selectedTab === 'timeTravel'}
          onClickHandler={() => setSelectedTab('timeTravel')}
        />
      )}
    </div>
  );
};

export default MapTabs;
