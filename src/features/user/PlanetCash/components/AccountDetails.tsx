import { ReactElement } from 'react';
import { styled } from '@mui/material';

const ListItem = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
  width: '100%',
}));

interface AccountDetailsProps {
  account: PlanetCash.Account;
}

const AccountDetails = ({ account }: AccountDetailsProps): ReactElement => {
  return (
    <ListItem>
      <p>{account.currency} PlanetCash Account</p>
      <p>{account.id}</p>
      <p>Balance: {account.balance}</p>
      <p>Debit: {account.debit || 0}</p>
      <p>Credit: {account.creditLimit}</p>
    </ListItem>
  );
};

export default AccountDetails;
