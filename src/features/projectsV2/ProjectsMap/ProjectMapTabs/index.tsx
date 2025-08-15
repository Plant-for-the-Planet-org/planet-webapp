import type { ReactElement } from 'react';

import styles from './ProjectMapTabs.module.scss';
import SingleTab from './SingleTab';
import { useTranslations } from 'next-intl';
import FieldDataIcon from '../../../../../public/assets/images/icons/FieldDataIcon';
import TimeTravelIcon from '../../../../../public/assets/images/icons/TimeTravelIcon';
import SatelliteAnalysisIcon from '../../../../../public/assets/images/icons/SatelliteAnalysisIcon';
import themeProperties from '../../../../theme/themeProperties';

export type SelectedTab = 'satellite' | 'field' | 'timeTravel';

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
  const { colors } = themeProperties.designSystem;
  const availableTabs: SelectedTab[] = [
    'satellite',
    'field',
    ...(isTimeTravelEnabled ? (['timeTravel'] as const) : []),
  ];

  const tMaps = useTranslations('Maps');

  if (availableTabs.length === 1) return null;

  const needsSeparator = (index: number) => {
    // No separator after last tab
    if (index >= availableTabs.length - 1) return false;

    const currentTab = availableTabs[index];
    const nextTab = availableTabs[index + 1];

    // Show separator only if both current and next tabs are unselected
    return selectedTab !== currentTab && selectedTab !== nextTab;
  };

  return (
    <div className={styles.tabsContainer}>
      <SingleTab
        icon={
          <SatelliteAnalysisIcon
            color={selectedTab === 'satellite' ? colors.white : colors.coreText}
          />
        }
        title={tMaps('satelliteAnalysis')}
        isSelected={selectedTab === 'satellite'}
        onClickHandler={() => setSelectedTab('satellite')}
      />
      {needsSeparator(0) && <div className={styles.separator} />}
      <SingleTab
        icon={
          <FieldDataIcon
            color={selectedTab === 'field' ? colors.white : colors.coreText}
          />
        }
        title={tMaps('fieldData')}
        isSelected={selectedTab === 'field'}
        onClickHandler={() => setSelectedTab('field')}
      />
      {needsSeparator(1) && <div className={styles.separator} />}
      {isTimeTravelEnabled && (
        <SingleTab
          icon={
            <TimeTravelIcon
              color={
                selectedTab === 'timeTravel' ? colors.white : colors.coreText
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
