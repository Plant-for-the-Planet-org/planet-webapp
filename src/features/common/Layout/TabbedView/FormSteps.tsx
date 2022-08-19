import React, { ReactElement, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TabItem } from './TabbedViewTypes';

interface FormStepsProps {
  step: number;
  tabItems: TabItem[];
}

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
  tabItems = [],
}: FormStepsProps): ReactElement | null {
  const router = useRouter();

  const handleTabChange = (event: SyntheticEvent) => {
    if (event.currentTarget instanceof HTMLButtonElement) {
      const targetLink = event.currentTarget.dataset.link as string;
      router.push(targetLink);
    }
  };

  const renderTabs = () => {
    return tabItems.map((tabItem, index) => {
      return (
        <StyledTab
          key={index}
          label={tabItem.label}
          data-link={tabItem.link}
          disabled={tabItem.disabled}
        />
      );
    });
  };

  return (
    <StyledTabs
      orientation="vertical"
      variant="scrollable"
      aria-label="form-steps"
      value={step}
      TabIndicatorProps={{ children: <span /> }}
      onChange={handleTabChange}
    >
      {renderTabs()}
    </StyledTabs>
  );
}
