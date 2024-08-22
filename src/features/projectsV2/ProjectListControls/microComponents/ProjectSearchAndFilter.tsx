import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import FilterIcon from '../../../../../public/assets/images/icons/projectV2/FilterIcon';
import styles from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';

interface ProjectSearchAndFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  hasFilterApplied: boolean | undefined;
  isMobile?: boolean; // only needed for mobile version
  debouncedSearchValue?: string; // only needed for mobile version
}

export const SearchAndFilter = ({
  hasFilterApplied,
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
  isMobile,
}: ProjectSearchAndFilterProps) => {
  const searchAndFilterContainer = isMobile
    ? styles.iconsContainerMobile
    : styles.iconsContainer;

  return (
    <div className={searchAndFilterContainer}>
      <button onClick={() => setIsSearching(!isSearching)}>
        <SearchIcon />
      </button>
      <div className={styles.buttonContainer}>
        {hasFilterApplied && <div className={styles.activeIndicator} />}
        <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <FilterIcon width={'16px'} />
        </button>
      </div>
    </div>
  );
};
