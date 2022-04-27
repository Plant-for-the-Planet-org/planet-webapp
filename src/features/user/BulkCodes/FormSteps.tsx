import React, { ReactElement, useState } from 'react';
import { Tab, Tabs } from 'mui-latest';
import { styled } from 'mui-latest/styles';
import i18next from '../../../../i18n';

interface FormStepsProps {
  step: number;
}

const { useTranslation } = i18next;

const StyledTabs = styled(Tabs)({
  paddingTop: 24,
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

export default function FormSteps({ step = 0 }: FormStepsProps): ReactElement {
  const { t, ready } = useTranslation(['bulkCodes']);
  // const [tabSelected, setTabSelected] = useState(step);

  return (
    <StyledTabs
      orientation="vertical"
      variant="scrollable"
      aria-label="form-steps"
      value={step}
      TabIndicatorProps={{ children: <span /> }}
    >
      <StyledTab label={t('bulkCodes:tabCreationMethod')} />
      <StyledTab label={t('bulkCodes:tabSelectProject')} />
      <StyledTab label={t('bulkCodes:tabIssueCodes')} />
    </StyledTabs>
  );
}
