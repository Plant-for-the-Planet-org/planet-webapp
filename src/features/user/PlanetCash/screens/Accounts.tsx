import type { ReactElement } from 'react';

import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';
import AccountDetails from '../components/AccountDetails';
import { usePlanetCashStore } from '../../../../stores';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';
import PlanetCashLoadError from '../components/PlanetCashLoadError';

const Accounts = (): ReactElement | null => {
  const planetCashAccounts = usePlanetCashStore(
    (state) => state.planetCashAccounts
  );
  const status = usePlanetCashStore((state) => state.status);

  if (status === 'idle' || status === 'loading') return <AccountListLoader />;

  if (status === 'error') return <PlanetCashLoadError />;

  if (planetCashAccounts && planetCashAccounts.length > 0) {
    return (
      <>
        {planetCashAccounts.map((account, index) => (
          <AccountDetails account={account} key={index} />
        ))}
      </>
    );
  }

  // This will not normally be seen, as the page redirects to create a new account once the fetch confirms the list is empty.
  return <NoPlanetCashAccount />;
};

export default Accounts;
