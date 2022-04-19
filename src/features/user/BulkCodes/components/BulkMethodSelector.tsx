import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';

import StyledButton from './StyledButton';
import SelectorOption, { SelectorOptionProps } from './SelectorOption';

import styles from '../BulkCodes.module.scss';

const { useTranslation } = i18next;

const BulkMethodSelector = (): ReactElement | null => {
  const [method, setMethod] = useState<string | null>(null);
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    const selectorOptions: SelectorOptionProps[] = [
      {
        method: 'import',
        title: t('bulkCodes:importMethodText.title'),
        subtitle: t('bulkCodes:importMethodText.subtitle'),
        details: t('bulkCodes:importMethodText.details', {
          returnObjects: true,
        }),
      },
      {
        method: 'generic',
        title: t('bulkCodes:genericMethodText.title'),
        subtitle: t('bulkCodes:genericMethodText.subtitle'),
        details: t('bulkCodes:genericMethodText.details', {
          returnObjects: true,
        }),
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
      <form className={styles.form}>
        <div className={styles.inputContainer}>{renderSelectorOptions()}</div>
        <StyledButton variant="contained">{t('common:continue')}</StyledButton>
      </form>
    );
  }
  return null;
};

export default BulkMethodSelector;
