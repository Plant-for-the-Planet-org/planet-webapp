import { ReactElement } from 'react';
import { PlanetCash } from '../../../common/types/user';

interface AccountDetailsProps {
  planetCash: PlanetCash;
}

const AccountDetails = ({ planetCash }: AccountDetailsProps): ReactElement => {
  return (
    <div>
      <p>{planetCash.currency} PlanetCash Account</p>
      <p>{planetCash.account}</p>
      <p>Balance: {planetCash.balance}</p>
      <p>Debit: {planetCash.debit || 0}</p>
      <p>Credit: {planetCash.creditLimit}</p>
    </div>
  );
};

export default AccountDetails;
