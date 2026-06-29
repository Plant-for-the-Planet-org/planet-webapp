import type { ReactElement } from 'react';
import type { SelectorOptionProps } from '../components/SelectorOption';

import { useState } from 'react';
import { Button } from '@mui/material';
import SelectorOption from '../components/SelectorOption';
import BulkCodesError from '../components/BulkCodesError';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeConstants';
import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useUserStore } from '../../../../stores';

const CreationMethodForm = (): ReactElement | null => {
  const {
    bulkMethod,
    setBulkMethod,
    setProject,
    setBulkGiftData,
    setTotalUnits,
  } = useBulkCode();
  const tCommon = useTranslations('Common');
  const tBulkCodes = useTranslations('BulkCodes');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // local state
  const [method, setMethod] = useState<BulkCodeMethods | null>(bulkMethod);
  // store: state
  const userPlanetCash = useUserStore((state) => state.userProfile?.planetCash);
  const selectorOptions: SelectorOptionProps[] = [
    {
      method: BulkCodeMethods.IMPORT,
      title: tBulkCodes('importMethodText.title'),
      subtitle: tBulkCodes('importMethodText.subtitle'),
      details: [
        tBulkCodes('importMethodText.details.line1'),
        tBulkCodes('importMethodText.details.line2'),
        tBulkCodes('importMethodText.details.line3'),
      ],
    },
    {
      method: BulkCodeMethods.GENERIC,
      title: tBulkCodes('genericMethodText.title'),
      subtitle: tBulkCodes('genericMethodText.subtitle'),
      details: [
        tBulkCodes('genericMethodText.details.line1'),
        tBulkCodes('genericMethodText.details.line2'),
        tBulkCodes('genericMethodText.details.line3'),
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
    router.push(localizedPath(`/profile/bulk-codes/${method}`));
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
              userPlanetCash &&
              !(userPlanetCash.balance + userPlanetCash.creditLimit <= 0)
            ) || method === null
          }
          onClick={handleFormSubmit}
        >
          {tCommon('continue')}
        </Button>
      </StyledForm>
    </CenteredContainer>
  );
};

export default CreationMethodForm;
