import React, { useState } from 'react';
import StarIcon from '../icons/StarIcon';
import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';
import style from '../Project/Search.module.scss';
import { Trans, useTranslation } from 'next-i18next';

interface SearchTabForMobileProps {
  numberOfProject: number;
}

export const SearchTabForMobile = ({
  numberOfProject,
}: SearchTabForMobileProps) => {
  const { t } = useTranslation(['projectDetails']);
  const [tabSelected, setTabSelected] = useState<'topProjects' | 'allProjects'>(
    'topProjects'
  );
  const [secondTabSelected, setSecondTabSelected] = useState<'list' | 'map'>(
    'list'
  );

  return (
    <div className={style.searchTabForMobile}>
      <div className={style.projectListTabs}>
        <button
          className={
            tabSelected === 'topProjects'
              ? style.activeTopProjectButton
              : style.topProjectButton
          }
          onClick={() => setTabSelected('topProjects')}
        >
          <div className={style.starIconConatiner}>
            <StarIcon
              height={'12px'}
              width={'12px'}
              color={tabSelected === 'topProjects' ? '#FFF' : '#219653'}
            />
          </div>
          <div
            className={
              tabSelected === 'topProjects'
                ? style.activeTopProjectLabelConatiner
                : style.topProjectLabelConatiner
            }
          >
            <div className={style.topProjectLable}>
              <Trans i18nKey="topProjects">
                Top Projects<p>({{ noOfProjects: `${numberOfProject}` }})</p>
              </Trans>
            </div>
          </div>
        </button>
        <button
          className={
            tabSelected === 'allProjects'
              ? style.activeAllProjectButton
              : style.allProjectButton
          }
          onClick={() => setTabSelected('allProjects')}
        >
          <div className={style.allProjectLabel}>
            <Trans i18nKey="all">
              All<p>({{ noOfProjects: `${numberOfProject}` }})</p>
            </Trans>
          </div>
        </button>
      </div>
      <div className={style.projectFeaturesMobile}>
        <button>
          <SearchIcon />
        </button>
        <button>
          <FilterIcon height={'16px'} width={'16px'} />
        </button>
      </div>
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
              color={secondTabSelected === 'list' ? '#fff' : '#333333'}
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
              color={secondTabSelected === 'map' ? '#fff' : '#333333'}
            />
          </div>
          <div className={style.mapLable}>{t('projectDetails:map')}</div>
        </button>
      </div>
    </div>
  );
};

export default SearchTabForMobile;
