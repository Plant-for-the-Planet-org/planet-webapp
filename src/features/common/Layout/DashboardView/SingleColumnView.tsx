import { ReactElement } from 'react';
import { Grid, styled } from '@mui/material';

const FormContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
}));

interface SingleColumnViewProps {
  children: React.ReactNode;
}

export default function SingleColumnView({
  children,
}: SingleColumnViewProps): ReactElement {
  return (
    <Grid container className="SingleColumnView">
      <Grid item xs={12} md={9} component={FormContainer}>
        {children}
      </Grid>
    </Grid>
  );
}
