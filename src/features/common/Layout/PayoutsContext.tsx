import type { ReactNode } from 'react';
import type { BankAccount, PayoutMinAmounts } from '../types/payouts';

import { createContext, useState, useContext } from 'react';

interface PayoutsContextInterface {
  accounts: BankAccount[] | null;
  setAccounts: (accounts: BankAccount[] | null) => void;
  payoutMinAmounts: PayoutMinAmounts | null;
  setPayoutMinAmounts: (payoutMinAmounts: PayoutMinAmounts | null) => void;
}

export const PayoutsContext = createContext<PayoutsContextInterface | null>(
  null
);

export const PayoutsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<BankAccount[] | null>(null);
  const [payoutMinAmounts, setPayoutMinAmounts] =
    useState<PayoutMinAmounts | null>(null);

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
