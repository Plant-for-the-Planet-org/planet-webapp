import React, { ReactElement } from 'react';
import { styled } from 'mui-latest';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeMethods';

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
  borderRadius: 9,
  padding: 24,
  '& input[type="radio"]': {
    display: 'none',
  },
  '& .optionLabel': {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  '& .optionDetails': {
    margin: '0 24px',
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
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
  const handleClick = () => {
    if (handleMethodChange) {
      handleMethodChange(method);
    }
  };

  const renderDetailsList = () => {
    return details.map((detail, index) => <li key={index}>{detail}</li>);
  };

  const optionClasses = `SelectorOption ${isSelected ? `selected` : null}`;
  return (
    <SelectorOptionContainer className={optionClasses} onClick={handleClick}>
      <input
        type="radio"
        name="method"
        value={method}
        id={method}
        checked={isSelected}
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
