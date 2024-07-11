import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SetState } from '../../features/common/types/common';

export type Classification =
  | 'allProjects'
  | 'large-scale-planting'
  | 'agroforestry'
  | 'natural-regeneration'
  | 'managed-regeneration'
  | 'urban-planting'
  | 'other-planting';

interface FilterProps {
  selectedFilter: Classification[];
  availableFilters: Classification[];
  setSelectedFilter: SetState<Classification[]>;
}

export const FilterDropDown = ({
  selectedFilter,
  availableFilters,
  setSelectedFilter,
}: FilterProps) => {
  const tAllProjects = useTranslations('AllProjects');

  const handleFilterSelection = (filterItem: Classification): void => {
    if (filterItem === 'allProjects') {
      setSelectedFilter([]);
    } else {
      const newFilter = selectedFilter.includes(filterItem)
        ? selectedFilter
        : [...selectedFilter, filterItem];
      setSelectedFilter(newFilter);
    }
  };
  return (
    <>
      {availableFilters.length > 0 ? (
        <div className={style.filterListContainer}>
          <button
            className={style.filterButton}
            onClick={() => handleFilterSelection('allProjects')}
          >
            <div
              className={
                selectedFilter === undefined
                  ? style.filterSelected
                  : style.projectName
              }
            >
              {tAllProjects('classificationTypes.allProjects')}
            </div>
            <hr className={style.hrLine} />
          </button>
          <div>
            {availableFilters.map((filterItem, index) => {
              return (
                <button
                  key={index}
                  className={style.filterButton}
                  onClick={() => handleFilterSelection(filterItem)}
                >
                  <div
                    className={
                      selectedFilter.includes(filterItem)
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

const Filter = ({ availableFilters }: FilterProps) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<Classification[]>([]);
  const isFilterApplied = selectedFilter.length > 0;

  return (
    <div className={style.filterContainer}>
      {isFilterApplied && <div className={style.filterIndicator} />}
      <Button
        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
        startIcon={<FilterIcon width={'16px'} />}
      />
      {isFilterDropdownOpen && (
        <FilterDropDown
          availableFilters={availableFilters}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      )}
    </div>
  );
};
export default Filter;
