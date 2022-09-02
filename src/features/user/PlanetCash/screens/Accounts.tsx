import { ReactElement } from 'react';
import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';
import AccountDetails from '../components/AccountDetails';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';

interface AccountsProps {
  accounts: PlanetCash.Account[] | null;
  setAccounts: (accounts: PlanetCash.Account[]) => void;
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: (isPlanetCashActive: boolean) => void;
  isDataLoading: boolean;
}

const Accounts = ({
  accounts,
  isPlanetCashActive,
  isDataLoading,
  setAccounts,
  setIsPlanetCashActive,
}: AccountsProps): ReactElement | null => {
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

  /* return (
    <>
      <AccountListLoader />
      <AccountListLoader />
    </>
  ); */

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
