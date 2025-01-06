import type { ReactElement } from 'react';
import type { BulkCodeMethods } from '../../../../utils/constants/bulkCodeConstants';

import React from 'react';
import { styled } from '@mui/material';

export interface SelectorOptionProps {
  method: BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT;
  title: string;
  subtitle: string;
  details: string[];
  isSelected?: boolean;
  handleMethodChange?: (
    method: BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT
  ) => void;
}

const SelectorOptionContainer = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  transition: `all .3s ease-in-out`,
  borderRadius: 9,
  '& input[type="radio"]': {
    display: 'none',
  },
  '& .optionLabel': {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 24,
    cursor: `pointer`,
  },
  '& .optionDetails': {
    margin: '0 24px',
  },
  '&.selected, &:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    transform: `scale(1.005)`,
  },
  '& .optionTitle': {
    fontSize: theme.typography.h2.fontSize,
    color: theme.palette.text.secondary,
  },
}));

const SelectorOption = ({
  method,
  title,
  subtitle,
  details,
  isSelected = false,
  handleMethodChange,
}: SelectorOptionProps): ReactElement => {
  const handleChange = () => {
    if (!isSelected && handleMethodChange) {
      handleMethodChange(method);
    }
  };

  const renderDetailsList = () => {
    return details.map((detail, index) => <li key={index}>{detail}</li>);
  };

  const optionClasses = `SelectorOption ${isSelected ? `selected` : null}`;
  return (
    <SelectorOptionContainer className={optionClasses}>
      <input
        type="radio"
        name="method"
        value={method}
        id={method}
        checked={isSelected}
        onChange={handleChange}
      />
      <label htmlFor={method} className="optionLabel">
        <h2 className="optionTitle">{title}</h2>
        <p>{subtitle}</p>
        <ul className="optionDetails">{renderDetailsList()}</ul>
      </label>
    </SelectorOptionContainer>
  );
};

export default SelectorOption;
