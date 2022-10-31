import { ReactElement } from 'react';
import { Grid } from '@mui/material';
import CenteredContainer from '../CenteredContainer';
interface SingleColumnViewProps {
  children: React.ReactNode;
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
      <Grid item xs={12} md={9} component={CenteredContainer}>
        {children}
      </Grid>
    </Grid>
  );
}
