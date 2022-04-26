import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { Button } from 'mui-latest';

import BulkCodesForm from './BulkCodesForm';
import SelectorOption, { SelectorOptionProps } from './SelectorOption';

const { useTranslation } = i18next;

interface CreationMethodFormProps {
  setStep?: (step: 0 | 1 | 2) => void;
}

const CreationMethodForm = ({
  setStep,
}: CreationMethodFormProps): ReactElement | null => {
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
      <BulkCodesForm className="CreationMethodForm">
        <div className="inputContainer">{renderSelectorOptions()}</div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={method === null}
          onClick={setStep ? () => setStep(1) : undefined}
        >
          {t('common:continue')}
        </Button>
      </BulkCodesForm>
    );
  }
  return null;
};

export default CreationMethodForm;
