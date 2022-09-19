import { ReactElement } from 'react';
import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';
import AccountDetails from '../components/AccountDetails';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';

interface AccountsProps {
  isDataLoading: boolean;
}

const Accounts = ({ isDataLoading }: AccountsProps): ReactElement | null => {
  const { accounts } = usePlanetCash();

  return isDataLoading ? (
    <>
      <AccountListLoader />
      <AccountListLoader />
    </>
  ) : accounts && accounts.length > 0 ? (
    <>
      {accounts?.map((account, index) => {
        return <AccountDetails account={account} key={index} />;
      })}
    </>
  ) : (
    accounts && <NoPlanetCashAccount />
  );
};

export default Accounts;
