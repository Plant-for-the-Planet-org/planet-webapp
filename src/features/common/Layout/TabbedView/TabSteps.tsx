import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TabItem } from './TabbedViewTypes';

interface TabStepsProps {
  step: number | string;
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

export default function TabSteps({
  step = 0,
  tabItems = [],
}: TabStepsProps): ReactElement | null {
  const router = useRouter();
  const [isStepFound, setIsStepFound] = useState(false);

  const handleTabChange = (event: SyntheticEvent) => {
    if (event.currentTarget instanceof HTMLButtonElement) {
      const targetLink = event.currentTarget.dataset.link as string;
      router.push(targetLink);
    }
  };

  useEffect(() => {
    // sets value for Tabs component only if the specified step is within the list of tabs
    if (tabItems)
      setIsStepFound(tabItems.some((tabItem) => tabItem.step === step));
  }, [step, tabItems]);

  const renderTabs = () => {
    return tabItems.map((tabItem, index) => {
      return (
        <StyledTab
          key={index}
          label={tabItem.label}
          data-link={tabItem.link}
          disabled={tabItem.disabled}
          value={tabItem.step}
        />
      );
    });
  };

  return (
    <StyledTabs
      orientation="vertical"
      variant="scrollable"
      aria-label="form-step"
      value={isStepFound ? step : false}
      TabIndicatorProps={{ children: <span /> }}
      onChange={handleTabChange}
    >
      {renderTabs()}
    </StyledTabs>
  );
}
