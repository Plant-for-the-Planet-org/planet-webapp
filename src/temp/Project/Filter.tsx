import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';
import { useTranslation } from 'next-i18next';

interface FilterProps {
  activeFilter: boolean;
  ecosystemType: string[];
}

export const FilterDropDown = ({
  activeFilter,
  ecosystemType,
}: FilterProps) => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <>
      {activeFilter && ecosystemType.length > 0 ? (
        <div className={style.projectListMainContainer}>
          <div className={style.container}>
            <h1>{t('projectDetails:allProjects')}</h1>

            {ecosystemType.map((singleEcosystem) => {
              return (
                <>
                  <hr />
                  <div className={style.projectName}>{singleEcosystem}</div>
                </>
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

const Filter = ({ activeFilter, projectList }: FilterProps) => {
  return (
    <div>
      <Button>
        <FilterIcon width={'16px'} />
      </Button>

      <FilterDropDown activeFilter={activeFilter} projectList={projectList} />
    </div>
  );
};
export default Filter;
