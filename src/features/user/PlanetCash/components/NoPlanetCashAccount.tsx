import { ReactElement } from 'react';
import { styled } from '@mui/material';

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
  width: '100%',
}));

const NoPlanetCashAccount = (): ReactElement => {
  return (
    <Container>
      <p>No account found. Create an account (Temp Text)</p>
    </Container>
  );
};

export default NoPlanetCashAccount;
