import { ReactElement } from 'react';
import { styled } from '@mui/material';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';

const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: 160,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NoTransactionsFound = (): ReactElement => {
  return (
    <Container>
      <TransactionsNotFound />
    </Container>
  );
};

export default NoTransactionsFound;
