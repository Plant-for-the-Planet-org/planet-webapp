import { useTranslations } from 'next-intl';
import themeProperties from '../../theme/themeProperties';
import { useState, ReactNode } from 'react';
import style from '../Project/Search.module.scss';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';

interface LocationListTabsProps {
  setIsFilterOpen: (value: boolean) => void;
}

interface TabItemProps {
  tab: 'list' | 'map';
  icon: ReactNode;
  label: 'list' | 'map';
}
const LocationListTabs = ({ setIsFilterOpen }: LocationListTabsProps) => {
  const t = useTranslations('ProjectDetails');
  const { dark, light } = themeProperties;
  const [secondTabSelected, setSecondTabSelected] = useState<'list' | 'map'>(
    'list'
  );
  const selectTab = (tab: 'list' | 'map') => {
    setIsFilterOpen(false);
    setSecondTabSelected(tab);
  };

  const TabItem = ({ tab, icon, label }: TabItemProps) => {
    return (
      <button
        className={`${
          secondTabSelected === tab ? style.activeButton : style.inActiveButton
        }`}
        onClick={() => selectTab(tab)}
      >
        {icon}
        <div className={style.label}>{label}</div>
      </button>
    );
  };

  return (
    <div className={style.listAndLocationContainer}>
      <TabItem
        tab="list"
        icon={
          <ListIcon
            width={14}
            color={
              secondTabSelected === 'list'
                ? `${light.light}`
                : `${dark.darkNew}`
            }
          />
        }
        label={'list'}
      />
      <TabItem
        tab="map"
        icon={
          <LocationIcon
            width={9}
            height={13}
            color={
              secondTabSelected === 'map' ? `${light.light}` : `${dark.darkNew}`
            }
          />
        }
        label={'map'}
      />
    </div>
  );
};

export default LocationListTabs;
