import { ReactElement } from 'react';
import { Grid, styled } from '@mui/material';
import FormSteps from './FormSteps';
import { TabItem } from './TabbedViewTypes';

const FormContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
  alignItems: 'flex-end',
  '&.formContainer--list': {
    backgroundColor: 'inherit',
    boxShadow: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    fontSize: '0.875rem',
  },
}));

interface TabbedViewProps {
  children: React.ReactNode;
  step: number;
  tabItems: TabItem[];
  isShowingList?: boolean;
}

export default function TabbedView({
  children,
  step,
  tabItems,
  isShowingList,
}: TabbedViewProps): ReactElement {
  return (
    <Grid container className="TabbedView">
      <Grid
        item
        xs={12}
        md={3}
        component={() => <FormSteps step={step} tabItems={tabItems} />}
      ></Grid>
      <Grid
        item
        xs={12}
        md={9}
        component={FormContainer}
        className={
          isShowingList ? 'formContainer--list' : 'formContainer--singular'
        }
      >
        {children}
      </Grid>
    </Grid>
  );
}
