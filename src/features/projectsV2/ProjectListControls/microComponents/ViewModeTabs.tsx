import { useState, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import style from '../styles/ProjectListControls.module.scss';
import ListIcon from '../../../../../public/assets/images/icons/projectV2/ListIcon';
import { SetState } from '../../../common/types/common';
import LocationIconOutline from '../../../../../public/assets/images/icons/projectV2/LocationIconOutline';

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
