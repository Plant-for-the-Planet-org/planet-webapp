import type { SetState } from '../../../common/types/common';
import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import FilterIcon from '../../../../../public/assets/images/icons/projectV2/FilterIcon';
import styles from '../styles/ProjectListControls.module.scss';
import { clsx } from 'clsx';

interface ProjectSearchAndFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  hasFilterApplied: boolean | undefined;
  isMobile?: boolean; // only needed for mobile version
  debouncedSearchValue?: string; // only needed for mobile version
  selectedMode?: 'map' | 'list'; // only needed for mobile version
}

export const SearchAndFilter = ({
  hasFilterApplied,
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
  isMobile,
  selectedMode,
}: ProjectSearchAndFilterProps) => {
  return (
    <div
      className={clsx({
        [styles.iconsContainerMobile]: isMobile,
        [styles.iconsContainer]: !isMobile,
        [styles.mapModeButtons]: isMobile && selectedMode === 'map',
      })}
    >
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
