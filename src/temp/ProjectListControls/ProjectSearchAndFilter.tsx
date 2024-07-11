import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import style from './Search.module.scss';
import { SetState } from '../../features/common/types/common';
import { Classification } from '.';

interface ProjectSearchAndFilterProps {
  selectedClassification: Classification[];
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  setIsSearching: SetState<boolean>;
  isSearching: boolean;
}

const ProjectSearchAndFilter = ({
  selectedClassification,
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
}: ProjectSearchAndFilterProps) => {
  const isFilterApplied = selectedClassification.length > 0;
  return (
    <div className={style.projectFeaturesMobile}>
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

export default ProjectSearchAndFilter;
