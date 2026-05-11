import type { ReactElement, SyntheticEvent } from 'react';
import type { TabItem } from './TabbedViewTypes';

import { Box, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

interface TabStepsProps {
  step: number | string | false;
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
  const { localizedPath } = useLocalizedPath();

  const handleTabChange = (
    _event: SyntheticEvent,
    newValue: string | number
  ) => {
    const next = tabItems.find((t) => t.step === newValue);
    if (next?.link) {
      router.push(localizedPath(next.link));
    }
  };

  const renderTabs = () => {
    return tabItems.map((tabItem, index) => {
      const discColor =
        tabItem.completionStatus === 'complete'
          ? 'success.main'
          : tabItem.completionStatus === 'incomplete'
          ? 'error.main'
          : '#d6d6d6'; // very light grey when status is unknown

      const label = (
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {tabItem.label}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              flexShrink: 0,
              backgroundColor: discColor,
            }}
          />
        </Box>
      );

      return (
        <StyledTab
          key={index}
          label={label}
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
      value={step}
      TabIndicatorProps={{ children: <span /> }}
      onChange={handleTabChange}
    >
      {renderTabs()}
    </StyledTabs>
  );
}
