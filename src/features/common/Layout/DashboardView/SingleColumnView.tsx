import { ReactElement } from 'react';
import { Grid } from '@mui/material';
import CenteredContainer from '../CenteredContainer';
interface SingleColumnViewProps {
  children: React.ReactNode;
}

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
