import themeProperties from '../../theme/themeProperties';
import { useState, ReactNode } from 'react';
import style from './ProjectListControls.module.scss';
import ListIcon from '../icons/ListIcon';
import { SetState } from '../../features/common/types/common';
import LocationIconPrimary from '../icons/LocationIconPrimary';
import { useTranslations } from 'next-intl';

interface ViewModeTabsProps {
  setIsFilterOpen: SetState<boolean>;
  isSearching: boolean;
}

type Tabs = 'list' | 'map';
interface TabItemProps {
  selectedTab: Tabs;
  icon: ReactNode;
  label: string | undefined;
}
const ViewModeTabs = ({ setIsFilterOpen, isSearching }: ViewModeTabsProps) => {
  const { dark, light } = themeProperties;
  const t = useTranslations('AllProjects');
  const [selectedMode, setSelectedMode] = useState<'list' | 'map'>('list');
  const selectTab = (tab: Tabs) => {
    setIsFilterOpen(false);
    setSelectedMode(tab);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    const isSelected = selectedMode === selectedTab;
    const tabButtonClass = isSelected
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

  const getIconColor = (mode: Tabs, selectMode: Tabs) =>
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
          <LocationIconPrimary
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
