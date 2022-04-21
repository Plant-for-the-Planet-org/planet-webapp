import React, { ReactElement } from 'react';
import { Box, Grid, ThemeProvider, styled } from 'mui-latest';

import muiThemeNew from '../../../../theme/muiThemeNew';

interface DashboardViewProps {
  title: string;
  subtitle: JSX.Element | null;
  children: React.ReactNode;
}

const DashboardGridContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.base,
  marginTop: 80,
  minHeight: '100vh',
  '& .dashboardGrid': {
    padding: 40,
    maxWidth: 1060,
    gap: 24,
  },
  '& .dashboardHeader': {
    gap: 10,
  },
  '& .dashboardTitle': {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.h1.fontSize,
  },
  '& *': {
    fontFamily: theme.typography.fontFamily,
  },
}));

export default function DashboardView({
  title,
  subtitle,
  children,
}: DashboardViewProps): ReactElement {
  return (
    <ThemeProvider theme={muiThemeNew}>
      <DashboardGridContainer className="DashboardView">
        <Grid container className="dashboardGrid">
          <Grid
            item
            container
            component="header"
            className="dashboardHeader"
            xs={12}
            md={10}
          >
            <Grid item component="h1" className="dashboardTitle">
              {title}
            </Grid>
            <Grid item className="dashboardSubtitle">
              {subtitle}
            </Grid>
          </Grid>
          <Grid item component="main">
            {children}
          </Grid>
        </Grid>
      </DashboardGridContainer>
    </ThemeProvider>
  );
}
