import React, { FormEvent, ReactElement } from 'react';

import styles from '../BulkCodes.module.scss';

export interface SelectorOptionProps {
  method: 'generic' | 'import';
  title: string;
  subtitle: string;
  details: string[];
  isSelected?: boolean;
  handleMethodChange?: (method: string) => void;
}

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

  const optionClasses = `${styles.selectorOption} ${
    isSelected ? `${styles.selected}` : null
  }`;
  return (
    <div className={optionClasses} onClick={handleClick}>
      <input
        type="radio"
        name="method"
        value={method}
        id={method}
        checked={isSelected}
      />
      <label htmlFor={method} className={styles.optionLabel}>
        <h2 className={styles.optionTitle}>{title}</h2>
        <p>{subtitle}</p>
        <ul className={styles.optionDetails}>{renderDetailsList()}</ul>
      </label>
    </div>
  );
};

export default SelectorOption;
