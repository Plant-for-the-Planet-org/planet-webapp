import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import i18next from '../../../../../i18n';
import { Button } from 'mui-latest';

import BulkCodesForm from './BulkCodesForm';
import SelectorOption, { SelectorOptionProps } from './SelectorOption';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeMethods';

const { useTranslation } = i18next;

interface CreationMethodFormProps {}

const CreationMethodForm = ({}: // setStep,
CreationMethodFormProps): ReactElement | null => {
  const router = useRouter();
  const {
    bulkMethod,
    setBulkMethod,
    setProject,
    setBulkGiftData,
    setTotalUnits,
  } = useBulkCode();
  const [method, setMethod] = useState<typeof bulkMethod>(bulkMethod);
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    const selectorOptions: SelectorOptionProps[] = [
      {
        method: BulkCodeMethods.IMPORT,
        title: t('bulkCodes:importMethodText.title'),
        subtitle: t('bulkCodes:importMethodText.subtitle'),
        details: t('bulkCodes:importMethodText.details', {
          returnObjects: true,
        }),
      },
      {
        method: BulkCodeMethods.GENERIC,
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

    const handleMethodChange = (method: typeof bulkMethod) => {
      setMethod(method);
    };

    const handleFormSubmit = () => {
      // Clear form data stored in context if method is changed
      if (method !== bulkMethod) {
        setProject(null);
        setBulkGiftData(null);
        setTotalUnits(null);
      }
      setBulkMethod(method);
      router.push(`/profile/bulk-codes/${bulkMethod}`);
    };

    return (
      <BulkCodesForm className="CreationMethodForm">
        <div className="inputContainer">{renderSelectorOptions()}</div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={method === null}
          onClick={handleFormSubmit}
        >
          {t('common:continue')}
        </Button>
      </BulkCodesForm>
    );
  }
  return null;
};

export default CreationMethodForm;
