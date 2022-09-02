import { ReactElement } from 'react';
import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';
import AccountDetails from '../components/AccountDetails';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';

interface AccountsProps {
  isDataLoading: boolean;
}

const Accounts = ({ isDataLoading }: AccountsProps): ReactElement | null => {
  const { accounts, isPlanetCashActive, setAccounts, setIsPlanetCashActive } =
    usePlanetCash();
  const updateAccount = (accountToUpdate: PlanetCash.Account): void => {
    const updatedAccounts = accounts?.map((account) =>
      account.id === accountToUpdate.id ? accountToUpdate : account
    );
    if (updatedAccounts) {
      setAccounts(updatedAccounts);
      setIsPlanetCashActive(
        updatedAccounts.some((account) => account.isActive)
      );
    }
  };

  return !accounts && isDataLoading ? (
    <>
      <AccountListLoader />
      <AccountListLoader />
    </>
  ) : accounts && accounts.length > 0 ? (
    <>
      {accounts?.map((account, index) => {
        return (
          <AccountDetails
            account={account}
            key={index}
            updateAccount={updateAccount}
            isPlanetCashActive={isPlanetCashActive}
          />
        );
      })}
    </>
  ) : (
    accounts && <NoPlanetCashAccount />
  );
};

export default Accounts;
