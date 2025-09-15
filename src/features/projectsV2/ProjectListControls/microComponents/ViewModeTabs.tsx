import type { ReactNode } from 'react';
import type { SetState } from '../../../common/types/common';
import type { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';

import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import styles from '../styles/ProjectListControls.module.scss';
import ListIcon from '../../../../../public/assets/images/icons/projectV2/ListIcon';
import LocationIconOutline from '../../../../../public/assets/images/icons/projectV2/LocationIconOutline';

interface ViewModeTabsProps {
  setIsFilterOpen: SetState<boolean> | undefined;
  isSearching: boolean | undefined;
  setSelectedMode: SetState<ViewMode> | undefined;
  selectedMode: ViewMode | undefined;
}

interface TabItemProps {
  selectedTab: ViewMode;
  icon: ReactNode;
  label: string | undefined;
}
const getIconColor = (mode: ViewMode, selectMode: ViewMode) => {
  const { colors } = themeProperties.designSystem;
  return mode === selectMode ? colors.white : colors.coreText;
};

const ViewModeTabs = ({
  setIsFilterOpen,
  isSearching,
  setSelectedMode,
  selectedMode,
}: ViewModeTabsProps) => {
  const t = useTranslations('AllProjects');

  const selectTab = (tab: ViewMode) => {
    if (setIsFilterOpen) {
      setIsFilterOpen(false);
    }
    if (setSelectedMode) setSelectedMode(tab);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    const isSelected = selectedMode === selectedTab;
    const tabButtonClass = isSelected
      ? styles.selectedTabButton
      : styles.unselectedTabButton;
    return (
      <button className={tabButtonClass} onClick={() => selectTab(selectedTab)}>
        {icon}
        <div className={styles.label}>{label}</div>
      </button>
    );
  };

  const tabContainerClass = `${
    isSearching ? styles.tabContainerSecondary : styles.tabContainer
  } ${selectedMode === 'map' ? styles.mapModeTabs : ''}`;

  return selectedMode ? (
    <div className={tabContainerClass}>
      <TabItem
        selectedTab="list"
        icon={
          <ListIcon height={14} color={getIconColor('list', selectedMode)} />
        }
        label={isSearching ? undefined : t('list')}
      />
      <TabItem
        selectedTab="map"
        icon={
          <LocationIconOutline
            height={14}
            color={getIconColor('map', selectedMode)}
          />
        }
        label={isSearching ? undefined : t('map')}
      />
    </div>
  ) : null;
};

export default ViewModeTabs;
