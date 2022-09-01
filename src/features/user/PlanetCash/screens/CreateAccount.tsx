import { ReactElement } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';

interface Props {
  accounts: PlanetCash.Account[] | null;
  isPlanetCashActive: boolean;
}

const CreateAccount = ({
  accounts,
  isPlanetCashActive,
}: Props): ReactElement => {
  return (
    <CreateAccountForm
      accounts={accounts}
      isPlanetCashActive={isPlanetCashActive}
    />
  );
};

export default CreateAccount;
