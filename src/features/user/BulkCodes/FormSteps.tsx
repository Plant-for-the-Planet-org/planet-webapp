import React, { ReactElement, useState } from 'react';
import { Tab, Tabs } from 'mui-latest';
import { styled } from 'mui-latest/styles';
import i18next from '../../../../i18n';
import themeProperties from '../../../theme/themeProperties';
import materialTheme from '../../../theme/themeStyles';

interface Props {}

const { useTranslation } = i18next;

const StyledTabs = styled(Tabs)({
  textTransform: 'capitalize',
  minWidth: '200px',
  '& .MuiTabs-indicator': {
    backgroundColor: themeProperties.primaryColor,
    left: 0,
  },
});

const StyledTab = styled(Tab)({
  textTransform: 'inherit',
  fontFamily: 'inherit',
  textAlign: 'left',
  alignItems: 'flex-start',
  '&.Mui-selected': {
    color: themeProperties.primaryColor,
    fontWeight: 600,
  },
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
