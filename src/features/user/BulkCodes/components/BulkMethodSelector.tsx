import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { styled, Button } from 'mui-latest';

import SelectorOption, { SelectorOptionProps } from './SelectorOption';

import styles from '../BulkCodes.module.scss';

const { useTranslation } = i18next;

const BulkMethodForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  '& .formButton': {
    marginTop: 24,
  },
  '& .inputContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
}));

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
      <BulkMethodForm className="BulkMethodSelector">
        <div className="inputContainer">{renderSelectorOptions()}</div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={method === null}
        >
          {t('common:continue')}
        </Button>
      </BulkMethodForm>
    );
  }
  return null;
};

export default BulkMethodSelector;
