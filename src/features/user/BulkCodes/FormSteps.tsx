import React, { ReactElement, useState } from 'react';
import { Tab, Tabs } from 'mui-latest';
import { styled } from 'mui-latest/styles';
import i18next from '../../../../i18n';

interface Props {}

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
  '&.Mui-selected': {
    /* fontWeight: 600, */
  },
  '&.MuiTab-root': {},
});

export default function FormSteps({}: Props): ReactElement {
  const { t, ready } = useTranslation(['bulkCodes']);
  const [tabSelected, setTabSelected] = useState(0);

  return (
    <StyledTabs
      orientation="vertical"
      variant="scrollable"
      aria-label="form-steps"
      value={tabSelected}
      TabIndicatorProps={{ children: <span /> }}
    >
      <StyledTab label={t('bulkCodes:tabCreationMethod')} />
      <StyledTab label={t('bulkCodes:tabSelectProject')} />
      <StyledTab label={t('bulkCodes:tabIssueCodes')} />
    </StyledTabs>
  );
}
