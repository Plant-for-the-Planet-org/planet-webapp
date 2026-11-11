import type { ReactElement } from 'react';

import BankAccountLoader from '../../../../../public/assets/images/icons/BankAccountLoader';
import BankAccountDetails from '../components/BankAccountDetails';
import NoBankAccount from '../components/NoBankAccount';
import BankAccountsLoadError from '../components/BankAccountsLoadError';
import { useManagePayoutStore } from '../../../../stores';

const Overview = (): ReactElement | null => {
  const accounts = useManagePayoutStore((state) => state.accounts);
  const accountsStatus = useManagePayoutStore((state) => state.accountsStatus);

  if (accountsStatus === 'idle' || accountsStatus === 'loading') {
    return <BankAccountLoader />;
  }

  if (accountsStatus === 'error') return <BankAccountsLoadError />;

  if (!accounts || accounts.length === 0) return <NoBankAccount />;

  return (
    <>
      {accounts.map((account) => (
        <BankAccountDetails key={account.id} account={account} />
      ))}
    </>
  );
};

export default Overview;
