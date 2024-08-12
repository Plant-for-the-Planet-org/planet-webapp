import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import styles from '../styles/ProjectListControls.module.scss';
import ListIcon from '../../../../../public/assets/images/icons/projectV2/ListIcon';
import { SetState } from '../../../common/types/common';
import LocationIconOutline from '../../../../../public/assets/images/icons/projectV2/LocationIconOutline';
import { ViewMode } from '../../../../../pages/_app';

interface ViewModeTabsProps {
  setIsFilterOpen: SetState<boolean> | undefined;
  isSearching: boolean | undefined;
  setSelectedMode: SetState<ViewMode>;
  selectedMode: ViewMode;
}

interface TabItemProps {
  selectedTab: ViewMode;
  icon: ReactNode;
  label: string | undefined;
}
const ViewModeTabs = ({
  setIsFilterOpen,
  isSearching,
  setSelectedMode,
  selectedMode,
}: ViewModeTabsProps) => {
  const { dark, light } = themeProperties;
  const t = useTranslations('AllProjects');

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

  const tabContainerClass = isSearching
    ? styles.tabContainerSecondary
    : styles.tabContainer;

  const getIconColor = (mode: ViewMode, selectMode: ViewMode) =>
    mode === selectMode ? light.light : dark.darkNew;

  return (
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
  );
};

export default ViewModeTabs;
