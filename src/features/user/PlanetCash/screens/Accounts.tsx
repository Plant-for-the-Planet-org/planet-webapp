import type { ReactElement } from 'react';

import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';
import AccountDetails from '../components/AccountDetails';
import { usePlanetCashStore } from '../../../../stores';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';

interface AccountsProps {
  isDataLoading: boolean;
}

const Accounts = ({ isDataLoading }: AccountsProps): ReactElement | null => {
  const planetCashAccounts = usePlanetCashStore(
    (state) => state.planetCashAccounts
  );

  if (isDataLoading) return <AccountListLoader />;

  if (planetCashAccounts && planetCashAccounts.length > 0) {
    return (
      <>
        {planetCashAccounts.map((account, index) => (
          <AccountDetails account={account} key={index} />
        ))}
      </>
    );
  }

  // This will never be seen, as the user is being redirected to create a new PCA when none exists
  return <NoPlanetCashAccount />;
};

export default Accounts;
