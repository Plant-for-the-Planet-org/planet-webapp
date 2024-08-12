import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';
import { availableFilters } from '../utils';
import { TreeProjectClassification } from '@planet-sdk/common';
import { MapProject } from '../../../common/types/projectv2';
import { ViewMode } from '../../../../../pages/_app';

interface ClassificationDropDownProps {
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  isMobile?: boolean;
  selectedMode?: ViewMode;
  projectsToDisplay?: MapProject[] | undefined | null;
}

export const ClassificationDropDown = ({
  selectedClassification,
  setSelectedClassification,
  isMobile,
  selectedMode,
  projectsToDisplay,
}: ClassificationDropDownProps) => {
  const tAllProjects = useTranslations('AllProjects');
  const handleFilterSelection = (
    filterItem: TreeProjectClassification
  ): void => {
    const newFilter = selectedClassification.includes(filterItem)
      ? selectedClassification.filter(
          (classification) => classification !== filterItem
        )
      : [...selectedClassification, filterItem];
    setSelectedClassification(newFilter);
  };
  const isFilterApplied = selectedClassification.length !== 0;
  return (
    <div
      className={`${styles.classificationListContainer} ${
        (isMobile && selectedMode === 'map') ||
        (isMobile && selectedMode === 'list' && projectsToDisplay?.length === 0)
          ? styles.mobileSelectMode
          : ''
      }`}
    >
      <button
        className={styles.filterButton}
        onClick={() => setSelectedClassification([])}
      >
        <div
          className={
            isFilterApplied
              ? styles.classificationUnselected
              : styles.classificationSelected
          }
        >
          {isFilterApplied
            ? tAllProjects('clearFilter')
            : tAllProjects('noFilterApplied')}
        </div>
        <hr className={styles.hrLine} />
      </button>
      <div>
        {availableFilters.map((filterItem, index) => {
          return (
            <button
              key={index}
              className={styles.filterButton}
              onClick={() => handleFilterSelection(filterItem)}
            >
              <div
                className={
                  selectedClassification?.includes(filterItem)
                    ? styles.classificationSelected
                    : styles.classificationUnselected
                }
              >
                {tAllProjects(`classificationTypes.${filterItem}`)}
              </div>
              {index !== availableFilters.length - 1 && (
                <hr className={styles.hrLine} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClassificationDropDown;
