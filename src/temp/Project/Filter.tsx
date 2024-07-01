import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export type Classification =
  | 'large-scale-planting'
  | 'agroforestry'
  | 'natural-regeneration'
  | 'managed-regeneration'
  | 'urban-planting'
  | 'other-planting';

interface FilterProps {
  filterApplied: Classification | undefined;
  setFilterApplied: (newValue: Classification | undefined) => void;
  availableFilters: Classification[];
}

export const FilterDropDown = ({
  filterApplied,
  setFilterApplied,
  availableFilters,
}: FilterProps) => {
  const tAllProjects = useTranslations('AllProjects');

  const handleFilterSelection = (
    filterItem: Classification | undefined
  ): void => {
    setFilterApplied(filterItem);
  };

  return (
    <>
      {availableFilters.length > 0 ? (
        <div className={style.projectListMainContainer}>
          <button
            className={style.filterButton}
            onClick={() => handleFilterSelection(undefined)}
          >
            <div
              className={
                filterApplied === undefined
                  ? style.filterSelected
                  : style.projectName
              }
            >
              {tAllProjects('classificationTypes.all')}
            </div>
            <hr className={style.hrLine} />
          </button>
          <div className={style.container}>
            {availableFilters.map((filterItem, index) => {
              return (
                <button
                  key={index}
                  className={style.filterButton}
                  onClick={() => handleFilterSelection(filterItem)}
                >
                  <div
                    className={
                      filterApplied === filterItem
                        ? style.filterSelected
                        : style.projectName
                    }
                  >
                    {tAllProjects(`classificationTypes.${filterItem}`)}
                  </div>
                  {index !== availableFilters.length - 1 && (
                    <hr className={style.hrLine} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const Filter = ({
  filterApplied,
  setFilterApplied,
  availableFilters,
}: FilterProps) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
        startIcon={<FilterIcon width={'16px'} />}
      />
      {isFilterDropdownOpen && (
        <FilterDropDown
          filterApplied={filterApplied}
          setFilterApplied={setFilterApplied}
          availableFilters={availableFilters}
        />
      )}
    </div>
  );
};
export default Filter;
