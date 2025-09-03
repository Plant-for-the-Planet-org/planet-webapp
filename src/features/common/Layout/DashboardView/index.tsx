import type { ReactElement, ReactNode } from 'react';

import { Box, Grid, ThemeProvider, styled } from '@mui/material';
import materialTheme from '../../../../theme/themeStyles';
import themeProperties from '../../../../theme/themeProperties';

interface DashboardViewProps {
  title?: string;
  subtitle?: string | ReactElement;
  children: ReactNode;
  variant?: 'full-width' | 'compact';
  multiColumn?: boolean;
}

const DashboardGridContainer = styled(Box)(({ theme }) => ({
  fontSize: themeProperties.fontSizes.fontSixteen,
  backgroundColor: theme.palette.background.base,
  marginTop: 80,
  minHeight: '100vh',
  '& .dashboardGrid': {
    [theme.breakpoints.up(481)]: {
      padding: '20px 40px 40px',
    },
    padding: '60px 20px 20px 20px',
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
    width: '100%',
  },
  '& main': {
    '&.dashboardContent--full-width': {
      width: '100%',
    },
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
  variant = 'full-width',
  multiColumn = false,
}: DashboardViewProps): ReactElement {
  const hasHeader = Boolean(title || subtitle);
  return (
    <ThemeProvider theme={materialTheme}>
      <DashboardGridContainer className="DashboardView">
        <Grid
          container
          className="dashboardGrid"
          style={{ maxWidth: multiColumn ? '100%' : 1060 }}
        >
          {hasHeader && (
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
          )}
          {!multiColumn ? (
            <Grid
              item
              component="main"
              className={`dashboardContent--${variant}`}
            >
              {children}
            </Grid>
          ) : (
            <Grid
              container
              component="main"
              className={`dashboardContent--${variant}`}
            >
              {children}
            </Grid>
          )}
        </Grid>
      </DashboardGridContainer>
    </ThemeProvider>
  );
}
