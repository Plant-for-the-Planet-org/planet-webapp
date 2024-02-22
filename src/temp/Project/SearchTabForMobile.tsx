import React, { useState } from 'react';
import StarIcon from '../icons/StarIcon';
import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import ListIcon from '../icons/ListIcon';
import LocationIcon from '../icons/LocationIcon';
import style from '../Project/Search.module.scss';
import { useTranslation } from 'next-i18next';

interface SearchTabForMobileProps {
  active: boolean;
}

export const SearchTabForMobile = ({ active }: SearchTabForMobileProps) => {
  const { t } = useTranslation(['projectDetails']);
  const [isAllProject, setIsAllProject] = useState(false);
  const [isTopProject, setIsTopProject] = useState(true);
  const [isList, setIsList] = useState(true);
  const [isLocation, setIsLocation] = useState(false);

  const _handleClick1 = () => {
    setIsTopProject(false);
    setIsAllProject(true);
  };

  const _handleClick2 = () => {
    setIsAllProject(false);
    setIsTopProject(true);
  };

  const _handleClick3 = () => {
    setIsLocation(false);
    setIsList(true);
  };

  const _handleClick4 = () => {
    setIsList(false);
    setIsLocation(true);
  };

  return (
    <div className={style.searchTabForMobile}>
      <div className={style.projectCateogary}>
        <button
          className={
            isTopProject ? style.activeTopProjectButton : style.topProjectButton
          }
          onClick={_handleClick2}
        >
          <div className={style.starIconConatiner}>
            <StarIcon
              height={'12px'}
              width={'12px'}
              color={isTopProject ? '#FFF' : '#219653'}
            />
          </div>
          <div
            className={
              isTopProject
                ? style.activeTopProjectLabelConatiner
                : style.topProjectLabelConatiner
            }
          >
            <div className={style.topProjectLable}>
              {t('projectDetails:topProjects', {
                noOfProjects: 56,
              })}
            </div>
          </div>
        </button>
        <button
          className={
            isAllProject ? style.activeAllProjectButton : style.allProjectButton
          }
          onClick={_handleClick1}
        >
          <div className={style.allProjectLabel}>
            {t('projectDetails:all', {
              noOfProjects: 56,
            })}
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
          className={isList ? style.activeListButton : style.listButton}
          onClick={_handleClick3}
        >
          <div>
            <ListIcon color={isList ? '#fff' : '#333333'} />
          </div>
          <div className={style.listLable}>{t('projectDetails:list')}</div>
        </button>
        <button
          className={
            isLocation ? style.activeLocationButton : style.locationButton
          }
          onClick={_handleClick4}
        >
          <div>
            <LocationIcon color={isLocation ? '#fff' : '#333333'} />
          </div>
          <div className={style.mapLable}>{t('projectDetails:map')}</div>
        </button>
      </div>
    </div>
  );
};

export default SearchTabForMobile;
