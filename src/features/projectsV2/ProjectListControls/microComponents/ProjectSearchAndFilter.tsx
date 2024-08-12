import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import FilterIcon from '../../../../../public/assets/images/icons/projectV2/FilterIcon';
import styles from '../styles/ProjectListControls.module.scss';
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
    ? styles.iconsContainerMobile
    : styles.iconsContainer;

  return (
    <div className={searchAndFilterContainer}>
      <div className={styles.filterContainer}>
        {isMobile &&
          searchProjectResults &&
          searchProjectResults?.length > 0 && (
            <div className={styles.filterIndicator} />
          )}
        <button onClick={() => setIsSearching(!isSearching)}>
          <SearchIcon />
        </button>
      </div>
      <div className={styles.filterContainer}>
        {isFilterApplied && <div className={styles.filterIndicator} />}
        <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <FilterIcon width={'16px'} />
        </button>
      </div>
    </div>
  );
};
