import type { SetState } from '../../../common/types/common';
import { useTranslations } from 'next-intl';
import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import FilterIcon from '../../../../../public/assets/images/icons/projectV2/FilterIcon';
import styles from '../styles/ProjectListControls.module.scss';
import { clsx } from 'clsx';
import { useProjectStore, useViewStore } from '../../../../stores';

interface ProjectSearchAndFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: SetState<boolean>;
  isMobile?: boolean; // only needed for mobile version
}

export const SearchAndFilter = ({
  setIsFilterOpen,
  isFilterOpen,
  isMobile,
}: ProjectSearchAndFilterProps) => {
  const t = useTranslations('AllProjects');

  // store: state
  const selectedMode = useViewStore((state) => state.selectedMode);
  const isFilterApplied = useProjectStore(
    (state) =>
      state.showDonatableProjects || state.selectedClassification.length > 0
  );
  const isSearching = useProjectStore((state) => state.isSearching);
  // store: action
  const setIsSearching = useProjectStore((state) => state.setIsSearching);

  return (
    <div
      className={clsx({
        [styles.iconsContainerMobile]: isMobile,
        [styles.iconsContainer]: !isMobile,
        [styles.mapModeButtons]: isMobile && selectedMode === 'map',
      })}
    >
      <button
        type="button"
        aria-label={t('searchProject')}
        onClick={() => setIsSearching(!isSearching)}
      >
        <span aria-hidden="true" style={{ display: 'contents' }}>
          <SearchIcon />
        </span>
      </button>
      <div className={styles.buttonContainer}>
        {isFilterApplied && <div className={styles.activeIndicator} />}
        <button
          type="button"
          aria-label={t('filterProjects')}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span aria-hidden="true" style={{ display: 'contents' }}>
            <FilterIcon width={'16px'} />
          </span>
        </button>
      </div>
    </div>
  );
};
