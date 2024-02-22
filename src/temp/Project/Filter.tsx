import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';
import { useTranslation } from 'next-i18next';

interface FilterProps {
  activeFilter: boolean;
  projectList: string[];
}

export const FilterDropDown = ({ activeFilter, projectList }: FilterProps) => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <>
      {activeFilter && projectList.length > 0 ? (
        <div className={style.projectListMainContainer}>
          <div className={style.container}>
            <h1>{t('projectDetails:allProjects')}</h1>

            {projectList.map((projectType) => {
              return (
                <>
                  <hr />
                  <div className={style.projectName}>{projectType}</div>
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
        <FilterIcon width={'16px'} height={'16px'} />
      </Button>

      <FilterDropDown activeFilter={activeFilter} projectList={projectList} />
    </div>
  );
};
export default Filter;
