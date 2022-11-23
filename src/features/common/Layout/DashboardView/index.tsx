import React, { ReactElement } from 'react';
import { Box, Grid, ThemeProvider, styled } from '@mui/material';

import muiThemeNew from '../../../../theme/muiThemeNew';

interface DashboardViewProps {
  title: string;
  subtitle: JSX.Element | null;
  children: React.ReactNode;
}

const DashboardGridContainer = styled(Box)(({ theme }) => ({
  fontSize: '1rem',
  backgroundColor: theme.palette.background.base,
  marginTop: 80,
  minHeight: '100vh',
  '& .dashboardGrid': {
    [theme.breakpoints.up(481)]: {
      padding: 40,
    },
    padding: '80px 20px 20px 20px',
    maxWidth: 1060,
    gap: 24,
    alignItems: 'flex-start',
  },
  '& .dashboardHeader': {
    gap: 10,
  },
  '& .dashboardTitle': {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.h1.fontSize,
  },
  '& main': {
    width: '100%',
  },
  '& *': {
    fontFamily: theme.typography.fontFamily,
  },
}));

/**
 * Returns a template layout for a Dashboard view with a `<header>` section and a `<main>` section
 */
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
