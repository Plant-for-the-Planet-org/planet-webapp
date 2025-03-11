import type { SetState } from '../../../common/types/common';
import type { TreeProjectClassification } from '@planet-sdk/common';
import type { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectListControls.module.scss';
import { availableFilters } from '../../../../utils/projectV2';
import {
  TreePlanting,
  Agroforestry,
  NaturalRegeneration,
  ManagedRegeneration,
  UrbanRestoration,
  OtherPlanting,
  Mangroves,
} from '../../../../../public/assets/images/icons/projectV2/PointMarkerIconsSymbol';
import DollarIcon from '../../../../../public/assets/images/icons/projectV2/DollarIcon';
// import TreePlanting from '../../../../../public/assets/images/icons/project/TreePlanting';

interface ClassificationDropDownProps {
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  showDonatableProjects: boolean;
  setShowDonatableProjects: SetState<boolean>;
  selectedMode?: ViewMode;
}

const classificationItemIcons = {
  'large-scale-planting': <TreePlanting width={'20'} height={'20'} />,
  agroforestry: <Agroforestry width={'20'} height={'20'} />,
  'natural-regeneration': <NaturalRegeneration width={'20'} height={'20'} />,
  'managed-regeneration': <ManagedRegeneration width={'20'} height={'20'} />,
  'urban-planting': <UrbanRestoration width={'20'} height={'20'} />,
  'other-planting': <OtherPlanting width={'20'} height={'20'} />,
  mangroves: <Mangroves width={'20'} height={'20'} />,
};

export const ClassificationDropDown = ({
  selectedClassification,
  setSelectedClassification,
  showDonatableProjects,
  setShowDonatableProjects,
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

  const isFilterApplied =
    selectedClassification.length > 0 || showDonatableProjects;

  const classificationListClasses = `${styles.classificationListContainer} ${
    selectedMode === 'list' ? styles.listMode : ''
  }`;

  const toggleDonatableProjects = () => {
    setShowDonatableProjects((prev) => !prev);
  };

  const classificationFilters = useMemo(() => {
    return availableFilters.map((filterItem, index) => (
      <button
        key={filterItem}
        className={styles.filterButton}
        onClick={() => handleFilterSelection(filterItem)}
      >
        <div
          className={`${
            selectedClassification?.includes(filterItem)
              ? styles.selected
              : styles.unselected
          } 
          ${styles.classificationItem}`}
        >
          {classificationItemIcons[filterItem]}
          {tAllProjects(`classificationTypes.${filterItem}`)}
        </div>
        {index !== availableFilters.length - 1 && (
          <hr className={styles.hrLine} />
        )}
      </button>
    ));
  }, [availableFilters, selectedClassification, handleFilterSelection]);

  return (
    <div className={classificationListClasses}>
      <button
        className={styles.filterButton}
        onClick={() => {
          setSelectedClassification([]);
          setShowDonatableProjects(false);
        }}
        type="button"
      >
        <div className={isFilterApplied ? styles.unselected : styles.selected}>
          {isFilterApplied
            ? tAllProjects('clearFilter')
            : tAllProjects('noFilterApplied')}
        </div>
        <hr className={styles.hrLine} />
      </button>
      <button
        type="button"
        className={styles.donationFilterButton}
        onClick={toggleDonatableProjects}
      >
        <div className={styles.donationFilterLabel}>
          <DollarIcon />
          <span
            className={
              showDonatableProjects ? styles.selected : styles.unselected
            }
          >
            {tAllProjects('acceptingDonations')}
          </span>
        </div>
        <hr className={styles.hrLine} />
      </button>
      <div>{classificationFilters}</div>
    </div>
  );
};

export default ClassificationDropDown;
