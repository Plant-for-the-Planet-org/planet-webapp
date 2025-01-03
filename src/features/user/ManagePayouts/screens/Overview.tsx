import type { ReactElement } from 'react';

import BankAccountLoader from '../../../../../public/assets/images/icons/BankAccountLoader';
import BankAccountDetails from '../components/BankAccountDetails';
import NoBankAccount from '../components/NoBankAccount';
import { usePayouts } from '../../../common/Layout/PayoutsContext';

interface Props {
  isDataLoading: boolean;
}

const Overview = ({ isDataLoading }: Props): ReactElement | null => {
  const { accounts } = usePayouts();

  return isDataLoading ? (
    <BankAccountLoader />
  ) : accounts && accounts.length > 0 ? (
    <>
      {accounts.map((account, index) => {
        return <BankAccountDetails account={account} key={index} />;
      })}
    </>
  ) : (
    <NoBankAccount />
  );
};

export default Overview;
