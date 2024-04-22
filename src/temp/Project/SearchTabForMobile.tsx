import React, { useState } from 'react';
import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';
import style from '../Project/Search.module.scss';
import { useTranslation } from 'next-i18next';
import themeProperties from '../../theme/themeProperties';
import ProjectListTabForMobile from './ProjectListTabForMobile';

interface SearchTabForMobileProps {
  numberOfProject: number;
}

export const SearchTabForMobile = ({
  numberOfProject,
}: SearchTabForMobileProps) => {
  const { t } = useTranslation(['projectDetails']);
  const { dark, light } = themeProperties;
  const [secondTabSelected, setSecondTabSelected] = useState<'list' | 'map'>(
    'list'
  );

  return (
    <div className={style.searchTabForMobile}>
      <ProjectListTabForMobile numberOfProject={numberOfProject} />

      <div className={style.listAndLocationContainer}>
        <button
          className={
            secondTabSelected === 'list'
              ? style.activeListButton
              : style.listButton
          }
          onClick={() => setSecondTabSelected('list')}
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
          <div className={style.listLable}>{t('projectDetails:list')}</div>
        </button>
        <button
          className={
            secondTabSelected === 'map'
              ? style.activeLocationButton
              : style.locationButton
          }
          onClick={() => setSecondTabSelected('map')}
        >
          <div>
            <LocationIcon
              color={
                secondTabSelected === 'map'
                  ? `${light.light}`
                  : `${dark.darkNew}`
              }
              width={'9px'}
              height={'13px'}
            />
          </div>
          <div className={style.mapLable}>{t('projectDetails:map')}</div>
        </button>
      </div>
    </div>
  );
};

export default SearchTabForMobile;
