import { ReactElement } from 'react';
import BankAccountLoader from '../../../../public/assets/images/icons/BankAccountLoader';
import { usePayouts } from '../../common/Layout/PayoutsContext';
import BankAccountDetails from './components/BankAccountDetails';

interface Props {
  isDataLoading: boolean;
}

const Overview = ({ isDataLoading = false }: Props): ReactElement | null => {
  const { accounts } = usePayouts();

  return isDataLoading ? (
    <>
      <BankAccountLoader />
      <BankAccountLoader />
    </>
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
