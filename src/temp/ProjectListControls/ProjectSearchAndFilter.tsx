import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import style from './ProjectListControls.module.scss';
import { SetState } from '../../features/common/types/common';
import { Classification } from '.';
import { useState, useEffect } from 'react';

interface ProjectSearchAndFilterProps {
  selectedClassification: Classification[];
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  setIsSearching: SetState<boolean>;
  isSearching: boolean;
}

export const SearchAndFilter = ({
  selectedClassification,
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
}: ProjectSearchAndFilterProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const isFilterApplied = selectedClassification.length > 0;
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 481);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const searchAndFilterContainer = isMobile
    ? style.iconsContainerMobile
    : style.iconsContainer;

  return (
    <div className={searchAndFilterContainer}>
      <button onClick={() => setIsSearching(!isSearching)}>
        <SearchIcon />
      </button>
      <div className={style.filterContainer}>
        {isFilterApplied && <div className={style.filterIndicator} />}
        <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <FilterIcon width={'16px'} />
        </button>
      </div>
    </div>
  );
};
