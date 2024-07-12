import themeProperties from '../../theme/themeProperties';
import { useState, ReactNode } from 'react';
import style from './Search.module.scss';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';
import { SetState } from '../../features/common/types/common';

interface ViewModeTabsProps {
  setIsFilterOpen: SetState<boolean>;
  isSearching: boolean;
}

interface TabItemProps {
  selectedTab: 'list' | 'map';
  icon: ReactNode;
  label: 'list' | 'map' | boolean;
}
const ViewModeTabs = ({ setIsFilterOpen, isSearching }: ViewModeTabsProps) => {
  const { dark, light } = themeProperties;
  const [selectedMode, setSelectedMode] = useState<'list' | 'map'>('list');
  const selectTab = (tab: 'list' | 'map') => {
    setIsFilterOpen(false);
    setSelectedMode(tab);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    const tabButtonClass =
      selectedMode === selectedTab
        ? style.selectedTabButton
        : style.unselectedTabButton;
    return (
      <button className={tabButtonClass} onClick={() => selectTab(selectedTab)}>
        {icon}
        <div className={style.label}>{label}</div>
      </button>
    );
  };

  const tabContainerClass = isSearching
    ? style.tabContainerSecondary
    : style.tabContainer;

  const listIconColor =
    selectedMode === 'list' ? `${light.light}` : `${dark.darkNew}`;

  const locationIconColor =
    selectedMode === 'map' ? `${light.light}` : `${dark.darkNew}`;

  return (
    <div className={tabContainerClass}>
      <TabItem
        selectedTab="list"
        icon={<ListIcon width={14} color={listIconColor} />}
        label={!isSearching && 'list'}
      />
      <TabItem
        selectedTab="map"
        icon={<LocationIcon width={9} height={13} color={locationIconColor} />}
        label={!isSearching && 'map'}
      />
    </div>
  );
};

export default ViewModeTabs;
