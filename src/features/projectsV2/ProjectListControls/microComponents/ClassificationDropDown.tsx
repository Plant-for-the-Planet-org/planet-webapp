import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import styles from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';
import { availableFilters } from '../utils';
import { TreeProjectClassification } from '@planet-sdk/common';
import { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { MapProject } from '../../../common/types/projectv2';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

interface ClassificationDropDownProps {
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  filteredProjects: MapProject[] | undefined;
  isMobile?: boolean;
  selectedMode?: ViewMode;
}

export const ClassificationDropDown = ({
  selectedClassification,
  setSelectedClassification,
  isMobile,
  selectedMode,
  filteredProjects,
}: ClassificationDropDownProps) => {
  const tAllProjects = useTranslations('AllProjects');
  const { isImpersonationModeOn } = useUserProps();
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

  const classificationListClasses = useMemo(() => {
    const isHidden =
      isMobile &&
      (selectedMode === 'map' ||
        (selectedMode === 'list' && filteredProjects?.length === 0));

    return `${styles.classificationListContainer} ${
      isHidden ? styles.mobileSelectMode : ''
    }`;
  }, [isMobile, selectedMode, filteredProjects, isImpersonationModeOn]);

  return (
    <div className={classificationListClasses}>
      <button
        className={styles.filterButton}
        onClick={() => {
          setSelectedClassification([]);
        }}
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
