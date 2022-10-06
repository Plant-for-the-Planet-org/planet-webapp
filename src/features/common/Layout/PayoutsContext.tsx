import { createContext, FC, useState, useContext } from 'react';

interface PayoutsContextInterface {
  accounts: Payouts.BankAccount[] | null;
  setAccounts: (accounts: Payouts.BankAccount[] | null) => void;
  payoutMinAmounts: Payouts.PayoutMinAmounts | null;
  setPayoutMinAmounts: (
    payoutMinAmounts: Payouts.PayoutMinAmounts | null
  ) => void;
}

export const PayoutsContext = createContext<PayoutsContextInterface | null>(
  null
);

export const PayoutsProvider: FC = ({ children }) => {
  const [accounts, setAccounts] = useState<Payouts.BankAccount[] | null>(null);
  const [payoutMinAmounts, setPayoutMinAmounts] =
    useState<Payouts.PayoutMinAmounts | null>(null);

  return (
    <PayoutsContext.Provider
      value={{
        accounts,
        setAccounts,
        payoutMinAmounts,
        setPayoutMinAmounts,
      }}
    >
      {children}
    </PayoutsContext.Provider>
  );
};

export const usePayouts = (): PayoutsContextInterface => {
  const context = useContext(PayoutsContext);
  if (!context) {
    throw new Error('PayoutsContext must be used within PayoutsProvider');
  }
  return context;
};
