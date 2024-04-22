import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import style from '../Project/Search.module.scss';

const ProjectSelectionFeatures = () => {
  return (
    <div className={style.projectFeaturesMobile}>
      <button>
        <SearchIcon />
      </button>
      <button>
        <FilterIcon width={'16px'} />
      </button>
    </div>
  );
};

export default ProjectSelectionFeatures;
