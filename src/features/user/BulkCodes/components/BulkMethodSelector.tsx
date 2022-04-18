import React, { ReactElement, useState } from 'react';
import SelectorOption, { SelectorOptionProps } from './SelectorOption';

import styles from '../BulkCodes.module.scss';

const BulkMethodSelector = (): ReactElement => {
  const [method, setMethod] = useState<string | null>(null);

  const selectorOptions: SelectorOptionProps[] = [
    {
      method: 'import',
      title: 'Import File',
      subtitle:
        'Use this method if one of the following criterias match your usecase:',
      details: [
        `I want to provide the Recipient's name or Email for each code`,
        `I want Plant-for-the-Planet to automatically email the recipients once it has been generated (optional)`,
        `I want to issue codes with different units of trees`,
      ],
    },
    {
      method: 'generic',
      title: 'Create Generic Codes',
      subtitle:
        'Use this method if the following criterias match your usecase:',
      details: [
        'All codes will have the same value',
        'I want to generate a number of code for arbitrary recipients',
        'Names and Emails cannot be associated with the code',
      ],
    },
  ];

  const renderSelectorOptions = () => {
    return selectorOptions.map((option, index) => (
      <SelectorOption
        method={option.method}
        title={option.title}
        subtitle={option.subtitle}
        details={option.details}
        handleMethodChange={handleMethodChange}
        isSelected={option.method === method}
        key={index}
      />
    ));
  };

  const handleMethodChange = (method: string) => {
    setMethod(method);
  };

  return (
    <div>
      <form>
        <div className={styles.inputContainer}>{renderSelectorOptions()}</div>
        <button onClick={(e) => e.preventDefault()}>Continue</button>
      </form>
    </div>
  );
};

export default BulkMethodSelector;
