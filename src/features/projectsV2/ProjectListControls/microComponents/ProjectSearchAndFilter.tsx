import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import FilterIcon from '../../../../temp/icons/FilterIcon';
import style from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';
import { TreeProjectClassification } from '@planet-sdk/common';
import { MapProject } from '../../../common/types/projectv2';
interface ProjectSearchAndFilterProps {
  selectedClassification: TreeProjectClassification[];
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  searchProjectResults: MapProject[] | null;
  isMobile?: boolean;
}

export const SearchAndFilter = ({
  selectedClassification,
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
  searchProjectResults,
  isMobile,
}: ProjectSearchAndFilterProps) => {
  const isFilterApplied = selectedClassification.length > 0;
  const searchAndFilterContainer = isMobile
    ? style.iconsContainerMobile
    : style.iconsContainer;

  return (
    <div className={searchAndFilterContainer}>
      <div className={style.filterContainer}>
        {isMobile &&
          searchProjectResults &&
          searchProjectResults?.length > 0 && (
            <div className={style.filterIndicator} />
          )}
        <button onClick={() => setIsSearching(!isSearching)}>
          <SearchIcon />
        </button>
      </div>
      <div className={style.filterContainer}>
        {isFilterApplied && <div className={style.filterIndicator} />}
        <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <FilterIcon width={'16px'} />
        </button>
      </div>
    </div>
  );
};
