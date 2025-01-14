import type { ReactElement, ReactNode } from 'react';
import type { TabItem } from './TabbedViewTypes';

import { useEffect, useState } from 'react';
import { Grid, styled } from '@mui/material';
import TabSteps from './TabSteps';

const TabContainer = styled('div')(() => ({
  backgroundColor: 'inherit',
  borderRadius: 9,
  boxShadow: 'none',
  alignItems: 'center',
  display: 'flex',
  '&.TabContainer': {
    flexDirection: 'column',
    gap: 16,
    '& .loadingButton': {
      minWidth: 150,
    },
  },
}));

interface TabbedViewProps {
  children: ReactNode;
  step: number | string;
  tabItems: TabItem[];
}

/**
 * Renders a two column MUI grid container.
 * Column 1 = Tabs. Column 2 = Content
 * Usually used within a `<DashboardView>` container
 */
export default function TabbedView({
  children,
  step,
  tabItems,
}: TabbedViewProps): ReactElement {
  const [isStepFound, setIsStepFound] = useState(false);
  const [stepToRender, setStepToRender] = useState<string | number | false>(
    false
  );

  useEffect(() => {
    // sets value for Tabs component only if the specified step is within the list of tabs
    if (tabItems && tabItems.length > 0)
      setIsStepFound(
        tabItems.some((tabItem) => {
          return tabItem.step === step;
        })
      );
  }, [step, tabItems]);

  useEffect(() => {
    setStepToRender(step);
  }, [isStepFound, step]);

  return (
    <Grid container className="TabbedView">
      <Grid
        item
        xs={12}
        md={3}
        component={() => <TabSteps step={stepToRender} tabItems={tabItems} />}
      ></Grid>
      <Grid
        item
        xs={12}
        md={9}
        component={TabContainer}
        className={'TabContainer'}
      >
        {children}
      </Grid>
    </Grid>
  );
}
