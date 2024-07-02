import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import style from './Search.module.scss';

interface ProjectSearchAndFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
}

const ProjectSearchAndFilter = ({
  setIsFilterOpen,
  isFilterOpen,
}: ProjectSearchAndFilterProps) => {
  return (
    <div className={style.projectFeaturesMobile}>
      <button>
        <SearchIcon />
      </button>
      <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
        <FilterIcon width={'16px'} />
      </button>
    </div>
  );
};

export default ProjectSearchAndFilter;
