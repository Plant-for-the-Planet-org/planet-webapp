import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import style from '../Project/Search.module.scss';

interface ProjectSelectionFeaturesProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
}

const ProjectSelectionFeatures = ({
  setIsFilterOpen,
  isFilterOpen,
}: ProjectSelectionFeaturesProps) => {
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

export default ProjectSelectionFeatures;
