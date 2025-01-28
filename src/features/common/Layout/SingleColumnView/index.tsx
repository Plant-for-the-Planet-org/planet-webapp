import type { ReactElement, ReactNode } from 'react';

import { Grid } from '@mui/material';
interface SingleColumnViewProps {
  children: ReactNode;
}

/**
 * Renders a single column MUI grid container.
 * Usually used within a `DashboardView` container
 */
export default function SingleColumnView({
  children,
}: SingleColumnViewProps): ReactElement {
  return (
    <Grid container className="SingleColumnView">
      <Grid item xs={12} md={9}>
        {children}
      </Grid>
    </Grid>
  );
}
