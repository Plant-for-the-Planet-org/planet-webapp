import themeProperties from '../../theme/themeProperties';
import { useState, ReactNode } from 'react';
import style from './Search.module.scss';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';

interface ViewModeTabsProps {
  setIsFilterOpen: (value: boolean) => void;
}

interface TabItemProps {
  selectedTab: 'list' | 'map';
  icon: ReactNode;
  label: 'list' | 'map';
}
const ViewModeTabs = ({ setIsFilterOpen }: ViewModeTabsProps) => {
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
    <div className={style.tabContainer}>
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
        label={'list'}
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
        label={'map'}
      />
    </div>
  );
};

export default ViewModeTabs;
