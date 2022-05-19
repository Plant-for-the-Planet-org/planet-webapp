import React, { ReactElement, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import { Tab, Tabs } from 'mui-latest';
import { styled } from 'mui-latest/styles';
import i18next from '../../../../i18n';
import { useBulkCode } from '../../../features/common/Layout/BulkCodeContext';

interface FormStepsProps {
  step: number;
}

const { useTranslation } = i18next;

const StyledTabs = styled(Tabs)({
  paddingTop: 24,
  paddingBottom: 24,
  textTransform: 'capitalize',
  minWidth: 200,
  '& .MuiTabs-flexContainer': {
    gap: 8,
  },
  '& .MuiTabs-indicator': {
    left: 0,
  },
});

const StyledTab = styled(Tab)({
  textTransform: 'inherit',
  alignItems: 'flex-start',
  padding: '0 16px',
});

export default function FormSteps({
  step = 0,
}: FormStepsProps): ReactElement | null {
  const { t, ready } = useTranslation(['bulkCodes']);
  const router = useRouter();
  const { bulkMethod, project } = useBulkCode();

  const handleTabChange = (event: SyntheticEvent) => {
    if (event.currentTarget instanceof HTMLButtonElement) {
      const targetLink = event.currentTarget.dataset.link as string;
      router.push(targetLink);
    }
  };

  if (ready) {
    return (
      <StyledTabs
        orientation="vertical"
        variant="scrollable"
        aria-label="form-steps"
        value={step}
        TabIndicatorProps={{ children: <span /> }}
        onChange={handleTabChange}
      >
        <StyledTab
          label={t('bulkCodes:tabCreationMethod')}
          data-link={`/profile/bulk-codes`}
        />
        <StyledTab
          label={t('bulkCodes:tabSelectProject')}
          data-link={
            bulkMethod !== null ? `/profile/bulk-codes/${bulkMethod}` : ''
          }
          disabled={bulkMethod === null}
        />
        <StyledTab
          label={t('bulkCodes:tabIssueCodes')}
          data-link={
            bulkMethod !== null && project !== null
              ? `/profile/bulk-codes/${bulkMethod}/${project.guid}`
              : ''
          }
          disabled={bulkMethod === null || project === null}
        />
      </StyledTabs>
    );
  }
  return null;
}
