import type { ReactNode } from 'react';
import type { SetState } from '../../../common/types/common';
import type { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';

import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import styles from '../styles/ProjectListControls.module.scss';
import ListIcon from '../../../../../public/assets/images/icons/projectV2/ListIcon';
import LocationIconOutline from '../../../../../public/assets/images/icons/projectV2/LocationIconOutline';
import { clsx } from 'clsx';
import { useViewStore } from '../../../../stores';

interface ViewModeTabsProps {
  setIsFilterOpen: SetState<boolean> | undefined;
  isSearching: boolean | undefined;
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
  selectedMode,
}: ViewModeTabsProps) => {
  const t = useTranslations('AllProjects');
  const setSelectedMode = useViewStore((state) => state.setSelectedMode);

  const selectTab = (tab: ViewMode) => {
    if (setIsFilterOpen) {
      setIsFilterOpen(false);
    }
    setSelectedMode(tab);
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

  if (!selectedMode) return null;

  return (
    <div
      className={clsx({
        [styles.tabContainerSecondary]: isSearching,
        [styles.tabContainer]: !isSearching,
        [styles.mapModeTabs]: selectedMode === 'map',
      })}
    >
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
  );
};

export default ViewModeTabs;
