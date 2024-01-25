import { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import { Button } from '@mui/material';
import style from './Filter.module.scss';

interface FilterProps {
  projectList: string[];
}

const Filter = ({ projectList }: FilterProps) => {
  const [isFilter, setIsFilter] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          if (isFilter) {
            setIsFilter(false);
          } else {
            setIsFilter(true);
          }
        }}
      >
        <FilterIcon width={'16px'} height={'16px'} />
      </Button>

      {isFilter ? (
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
