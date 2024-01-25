import { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';

interface FilterProps {
  active: boolean;
  projectList: string[];
}

const Filter = ({ active, projectList }: FilterProps) => {
  return (
    <div>
      <Button>
        <FilterIcon width={'16px'} height={'16px'} />
      </Button>

      {active && projectList.length > 0 ? (
        <div className={style.projectListMainContainer}>
          <div className={style.container}>
            <h1>All Projects</h1>

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
    </div>
  );
};
export default Filter;
