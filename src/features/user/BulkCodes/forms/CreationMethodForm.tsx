import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import SelectorOption, {
  SelectorOptionProps,
} from '../components/SelectorOption';
import BulkCodesError from '../components/BulkCodesError';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeConstants';
import { useTranslation } from 'next-i18next';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';

const CreationMethodForm = (): ReactElement | null => {
  const router = useRouter();
  const {
    bulkMethod,
    setBulkMethod,
    setProject,
    setBulkGiftData,
    setTotalUnits,
  } = useBulkCode();
  const [method, setMethod] = useState<BulkCodeMethods | null>(bulkMethod);
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { user } = useUserProps();

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
          handleMethodChange={setMethod}
          isSelected={option.method === method}
          key={index}
        />
      ));
    };

    const handleFormSubmit = () => {
      // Clear form data stored in context if method is changed
      if (bulkMethod) {
        if (method !== bulkMethod) {
          setProject(null);
          setBulkGiftData(null);
          setTotalUnits(null);
        }
      }
      setBulkMethod(method);
      router.push(`/profile/bulk-codes/${method}`);
    };

    return (
      <CenteredContainer>
        <StyledForm className="CreationMethodForm">
          <div className="inputContainer">{renderSelectorOptions()}</div>

          <BulkCodesError />

          <Button
            variant="contained"
            color="primary"
            className="formButton"
            disabled={
              !(
                user.planetCash &&
                !(user.planetCash.balance + user.planetCash.creditLimit <= 0)
              ) || method === null
            }
            onClick={handleFormSubmit}
          >
            {t('common:continue')}
          </Button>
        </StyledForm>
      </CenteredContainer>
    );
  }
  return null;
};

export default CreationMethodForm;
