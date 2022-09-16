import { ReactElement } from 'react';
import { usePayouts } from '../../../common/Layout/PayoutsContext';
import BankDetailsForm from '../components/BankDetailsForm';

const AddBankAccount = (): ReactElement | null => {
  const { payoutMinAmounts } = usePayouts();

  return payoutMinAmounts ? (
    <>
      <BankDetailsForm payoutMinAmounts={payoutMinAmounts} />
    </>
  ) : null;
};

export default AddBankAccount;
