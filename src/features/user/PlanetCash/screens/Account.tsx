import { ReactElement, useContext } from 'react';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import AccountDetails from '../components/AccountDetails';
import CreateAccount from '../components/CreateAccount';

const Account = (): ReactElement => {
  const { planetCash } = useContext(UserPropsContext).user;

  return planetCash ? (
    <AccountDetails planetCash={planetCash} />
  ) : (
    <CreateAccount />
  );
};

export default Account;
