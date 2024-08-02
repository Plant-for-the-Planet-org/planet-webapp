import { useTranslations } from 'next-intl';
import style from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';
import { availableFilters } from '../utils';
import { TreeProjectClassification } from '@planet-sdk/common';

interface ClassificationDropDownProps {
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
}

export const ClassificationDropDown = ({
  selectedClassification,
  setSelectedClassification,
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
    <div className={style.classificationListContainer}>
      <button
        className={style.filterButton}
        onClick={() => setSelectedClassification([])}
      >
        <div
          className={
            isFilterApplied
              ? style.classificationUnselected
              : style.classificationSelected
          }
        >
          {isFilterApplied
            ? tAllProjects('clearFilter')
            : tAllProjects('noFilterApplied')}
        </div>
        <hr className={style.hrLine} />
      </button>
      <div>
        {availableFilters.map((filterItem, index) => {
          return (
            <button
              key={index}
              className={style.filterButton}
              onClick={() => handleFilterSelection(filterItem)}
            >
              <div
                className={
                  selectedClassification?.includes(filterItem)
                    ? style.classificationSelected
                    : style.classificationUnselected
                }
              >
                {tAllProjects(`classificationTypes.${filterItem}`)}
              </div>
              {index !== availableFilters.length - 1 && (
                <hr className={style.hrLine} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClassificationDropDown;
