import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import FilterIcon from '../../../../temp/icons/FilterIcon';
import style from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';
import { Classification } from '..';
import { useProjects } from '../../ProjectsContext';
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
  const { isMobile } = useProjects();
  const isFilterApplied = selectedClassification.length > 0;

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
