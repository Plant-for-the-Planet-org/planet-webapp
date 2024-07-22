import style from './ProjectListControls.module.scss';
import { useTranslations } from 'next-intl';
import { Classification } from '.';
import { SetState } from '../../features/common/types/common';

interface ClassificationDropDownProps {
  selectedClassification: Classification[];
  availableFilters: Classification[];
  setSelectedClassification: SetState<Classification[]>;
}

export const ClassificationDropDown = ({
  selectedClassification,
  availableFilters,
  setSelectedClassification,
}: ClassificationDropDownProps) => {
  const tAllProjects = useTranslations('AllProjects');

  const handleFilterSelection = (filterItem: Classification): void => {
    if (filterItem === 'allProjects') {
      setSelectedClassification([]);
    } else {
      const newFilter = selectedClassification.includes(filterItem)
        ? selectedClassification.filter(
            (classification) => classification !== filterItem
          )
        : [...selectedClassification, filterItem];
      setSelectedClassification(newFilter);
    }
  };
  return (
    <>
      {availableFilters.length > 0 ? (
        <div className={style.classificationListContainer}>
          <button
            className={style.filterButton}
            onClick={() => handleFilterSelection('allProjects')}
          >
            <div
              className={
                selectedClassification.length === 0
                  ? style.classificationSelected
                  : style.classificationUnselected
              }
            >
              {tAllProjects('classificationTypes.allProjects')}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default ClassificationDropDown;
