import { ReactElement } from 'react';
import AccountDetails from '../components/AccountDetails';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';

interface AccountsProps {
  accounts: PlanetCash.Account[] | null;
  setAccounts: (accounts: PlanetCash.Account[]) => void;
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: (isPlanetCashActive: boolean) => void;
}

const Accounts = ({
  accounts,
  isPlanetCashActive,
  setAccounts,
  setIsPlanetCashActive,
}: AccountsProps): ReactElement => {
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

  return accounts && accounts.length > 0 ? (
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
    <NoPlanetCashAccount />
  );
};

export default Accounts;
