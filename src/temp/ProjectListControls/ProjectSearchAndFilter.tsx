import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import style from './Search.module.scss';
import { SetState } from '../../features/common/types/common';

interface ProjectSearchAndFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  setIsSearching: SetState<boolean>;
  isSearching: boolean;
}

const ProjectSearchAndFilter = ({
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
}: ProjectSearchAndFilterProps) => {
  return (
    <div className={style.projectFeaturesMobile}>
      <button onClick={() => setIsSearching(!isSearching)}>
        <SearchIcon />
      </button>
      <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
        <FilterIcon width={'16px'} />
      </button>
    </div>
  );
};

export default ProjectSearchAndFilter;
