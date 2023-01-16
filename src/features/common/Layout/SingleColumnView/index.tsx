import { ReactElement } from 'react';
import { Grid, styled } from '@mui/material';
import CenteredContainer from '../CenteredContainer';
interface SingleColumnViewProps {
  children: React.ReactNode;
}

const StyledGrid = styled(Grid)`
  & {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
  }
`;

/**
 * Renders a single column MUI grid container.
 * Usually used within a `DashboardView` container
 */
export default function SingleColumnView({
  children,
}: SingleColumnViewProps): ReactElement {
  return (
    <Grid container className="SingleColumnView">
      <StyledGrid item xs={12} md={9} component={CenteredContainer}>
        {children}
      </StyledGrid>
    </Grid>
  );
}
