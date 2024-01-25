import React from 'react';
import Button from '@mui/material/Button';
import ExploreIcon from '../icons/ExploreIcon';
import style from './Explore.module.scss';

interface ExploreButtonProps {
  label: string;
}

const ExploreButton = ({ label }: ExploreButtonProps) => {
  return (
    <Button startIcon={<ExploreIcon />} className={style.customButton}>
      {label}
    </Button>
  );
};

export default ExploreButton;
