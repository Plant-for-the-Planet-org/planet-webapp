import type { ReactElement } from 'react';

import BankAccountLoader from '../../../../../public/assets/images/icons/BankAccountLoader';
import BankAccountDetails from '../components/BankAccountDetails';
import NoBankAccount from '../components/NoBankAccount';
import { useManagePayoutStore } from '../../../../stores';

interface Props {
  isDataLoading: boolean;
}

const Overview = ({ isDataLoading }: Props): ReactElement | null => {
  const accounts = useManagePayoutStore((state) => state.accounts);

  if (isDataLoading) return <BankAccountLoader />;

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
