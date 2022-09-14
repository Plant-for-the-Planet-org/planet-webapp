import { ReactElement } from 'react';
import { usePayouts } from '../../common/Layout/PayoutsContext';
import BankAccountDetails from './components/BankAccountDetails';

interface Props {
  isDataLoading: boolean;
}

const Overview = ({ isDataLoading = false }: Props): ReactElement | null => {
  const { accounts } = usePayouts();

  return isDataLoading ? (
    <div>Loading..</div>
  ) : accounts && accounts.length > 0 ? (
    <>
      {accounts?.map((account, index) => {
        return (
          <BankAccountDetails
            account={account}
            key={index}
            /* updateAccount={updateAccount} */
          />
        );
      })}
    </>
  ) : (
    accounts && <div>No accounts found</div>
  );
};

export default Overview;
