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
  label: 'list' | 'map' | undefined;
}
const ViewModeTabs = ({ setIsFilterOpen, isSearching }: ViewModeTabsProps) => {
  const { dark, light } = themeProperties;
  const [selectedMode, setSelectedMode] = useState<'list' | 'map'>('list');
  const selectTab = (tab: 'list' | 'map') => {
    setIsFilterOpen(false);
    setSelectedMode(tab);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    return (
      <button
        className={`${
          selectedMode === selectedTab
            ? style.selectedTabButton
            : style.unselectedTabButton
        }`}
        onClick={() => selectTab(selectedTab)}
      >
        {icon}
        <div className={style.label}>{label}</div>
      </button>
    );
  };

  return (
    <div
      className={`${
        isSearching ? style.tabContainerSecondary : style.tabContainer
      }`}
    >
      <TabItem
        selectedTab="list"
        icon={
          <ListIcon
            width={14}
            color={
              selectedMode === 'list' ? `${light.light}` : `${dark.darkNew}`
            }
          />
        }
        label={isSearching ? undefined : 'list'}
      />
      <TabItem
        selectedTab="map"
        icon={
          <LocationIcon
            width={9}
            height={13}
            color={
              selectedMode === 'map' ? `${light.light}` : `${dark.darkNew}`
            }
          />
        }
        label={isSearching ? undefined : 'map'}
      />
    </div>
  );
};

export default ViewModeTabs;
