import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

interface FilterProps {
  isFilter: boolean;
}

export const FilterDropDown = ({ isFilter }: FilterProps) => {
  const { t } = useTranslation(['projectDetails', 'donate', 'manageProjects']);
  const [selectEcosystem, setSelectEcosystem] = useState('');
  const ecosystemType = [
    t('projectDetails:allProjects'),
    t('manageProjects:naturalRegeneration'),
    t('manageProjects:mangroves'),
    t('manageProjects:managedRegeneration'),
    t('manageProjects:otherRestoration'),
    t('manageProjects:treePlanting'),
    t('manageProjects:agroforestry'),
    t('donate:urban-planting'),
    t('donate:conservation'),
  ];
  const handleClick = (singleEcosystem: string): void => {
    setSelectEcosystem(singleEcosystem);
  };
  return (
    <>
      {isFilter && ecosystemType.length > 0 ? (
        <div className={style.projectListMainContainer}>
          <div className={style.container}>
            {ecosystemType.map((singleEcosystem, index) => {
              return (
                <button
                  key={index}
                  className={style.ecosystemButton}
                  onClick={() => handleClick(singleEcosystem)}
                >
                  <div
                    className={
                      selectEcosystem === singleEcosystem
                        ? style.ecosystemSelected
                        : style.projectName
                    }
                  >
                    {singleEcosystem}
                  </div>
                  {index !== ecosystemType.length - 1 && (
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

const Filter = ({ isFilter }: FilterProps) => {
  return (
    <div>
      <Button>
        <FilterIcon width={'16px'} />
      </Button>

      <FilterDropDown isFilter={isFilter} />
    </div>
  );
};
export default Filter;
