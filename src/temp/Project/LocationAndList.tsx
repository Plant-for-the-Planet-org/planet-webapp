import { useTranslations } from 'next-intl';
import themeProperties from '../../theme/themeProperties';
import { useState } from 'react';
import style from '../Project/Search.module.scss';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';

interface LocationAndListProps {
  setIsFilterOpen: (value: boolean) => void;
}
const LocationAndList = ({ setIsFilterOpen }: LocationAndListProps) => {
  const t = useTranslations('ProjectDetails');
  const { dark, light } = themeProperties;
  const [secondTabSelected, setSecondTabSelected] = useState<'list' | 'map'>(
    'list'
  );
  return (
    <div className={style.listAndLocationContainer}>
      <button
        className={
          secondTabSelected === 'list'
            ? style.activeListButton
            : style.listButton
        }
        onClick={() => {
          setIsFilterOpen(false);
          setSecondTabSelected('list');
        }}
      >
        <div style={{ marginTop: '3px' }}>
          <ListIcon
            width={'14px'}
            color={
              secondTabSelected === 'list'
                ? `${light.light}`
                : `${dark.darkNew}`
            }
          />
        </div>
        <div className={style.listLable}>{t('list')}</div>
      </button>
      <button
        className={
          secondTabSelected === 'map'
            ? style.activeLocationButton
            : style.locationButton
        }
        onClick={() => {
          setIsFilterOpen(false);
          setSecondTabSelected('map');
        }}
      >
        <div>
          <LocationIcon
            color={
              secondTabSelected === 'map' ? `${light.light}` : `${dark.darkNew}`
            }
            width={'9px'}
            height={'13px'}
          />
        </div>
        <div className={style.mapLable}>{t('map')}</div>
      </button>
    </div>
  );
};

export default LocationAndList;
