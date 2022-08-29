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

  const fetchAccounts = async () => {
    const accounts = await getAuthenticatedRequest(
      `/app/planetCash`,
      token,
      {},
      handleError
    );
    setAccounts(accounts);
  };

  const updateAccount = (accountToUpdate: PlanetCash.Account) => {
    const updatedAccounts = accounts?.map((account) =>
      account.id === accountToUpdate.id ? accountToUpdate : account
    );
    if (updatedAccounts) setAccounts(updatedAccounts);
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
          />
        );
      })}
    </>
  ) : (
    <NoPlanetCashAccount />
  );
};

export default Accounts;
