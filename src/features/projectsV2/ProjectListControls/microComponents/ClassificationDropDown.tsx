import type { SetState } from '../../../common/types/common';
import type { TreeProjectClassification } from '@planet-sdk/common';
import type { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectListControls.module.scss';
import { availableFilters } from '../../../../utils/projectV2';

interface ClassificationDropDownProps {
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  selectedMode?: ViewMode;
}

export const ClassificationDropDown = ({
  selectedClassification,
  setSelectedClassification,
  selectedMode,
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

  const classificationListClasses = useMemo(() => {
    return `${styles.classificationListContainer} ${
      selectedMode === 'list' ? styles.listMode : ''
    }`;
  }, [selectedMode]);

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
