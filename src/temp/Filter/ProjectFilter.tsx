import React from 'react';
import { FilterIcon } from '../icons/FilterProjectIcon';
import { Button } from '@mui/material';

const ProjectFilter = ({ width, height }) => {
  const handleFilter = () => {};
  return (
    <Button onClick={() => handleFilter}>
      <FilterIcon width={width} height={height} />
    </Button>
  );
};

export default ProjectFilter;
