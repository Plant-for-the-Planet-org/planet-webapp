import { ReactElement, useContext, useEffect, useState } from 'react';
import AccountDetails from '../components/AccountDetails';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

const Accounts = (): ReactElement => {
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [accounts, setAccounts] = useState<PlanetCash.Account[] | null>(null);
  const [isPlanetCashActive, setIsPlanetCashActive] = useState(false);

  const fetchAccounts = async () => {
    const accounts = await getAuthenticatedRequest<PlanetCash.Account[]>(
      `/app/planetCash`,
      token,
      {},
      handleError
    );
    const sortedAccounts = sortAccountsByActive(accounts);
    setIsPlanetCashActive(accounts.some((account) => account.isActive));
    setAccounts(sortedAccounts);
  };

  const sortAccountsByActive = (
    accounts: PlanetCash.Account[]
  ): PlanetCash.Account[] => {
    return accounts.sort((accountA, accountB) => {
      if (accountA.isActive === accountB.isActive) {
        return 0;
      } else {
        return accountA.isActive ? -1 : 1;
      }
    });
  };

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

  useEffect(() => {
    if (contextLoaded && token) fetchAccounts();
  }, [contextLoaded, token]);

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
