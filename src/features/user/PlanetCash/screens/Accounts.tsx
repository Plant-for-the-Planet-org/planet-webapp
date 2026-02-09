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

  return isDataLoading ? (
    <>
      <AccountListLoader />
    </>
  ) : planetCashAccounts && planetCashAccounts.length > 0 ? (
    <>
      {planetCashAccounts?.map((account, index) => {
        return <AccountDetails account={account} key={index} />;
      })}
    </>
  ) : (
    //This will never be seen, as the user is being redirected to create a new PCA when none exists
    <NoPlanetCashAccount />
  );
};

export default Accounts;
