import type { ReactNode } from 'react';
import type { PlanetCashAccount } from '../types/planetcash';

import { createContext, useState, useContext, useCallback } from 'react';

interface PlanetCashContextInterface {
  accounts: PlanetCashAccount[] | null;
  setAccounts: (accounts: PlanetCashAccount[] | null) => void;
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: (isPlanetCashActive: boolean) => void;
  updateAccount: (updatedAccount: PlanetCashAccount) => void;
}

export const PlanetCashContext =
  createContext<PlanetCashContextInterface | null>(null);

export const PlanetCashProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<PlanetCashAccount[] | null>(null);
  const [isPlanetCashActive, setIsPlanetCashActive] = useState<boolean>(false);

  const updateAccount = useCallback((updatedAccount: PlanetCashAccount) => {
    setAccounts((prevAccounts) => {
      if (!prevAccounts) return prevAccounts;
      return prevAccounts.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account
      );
    });
  }, []);

  return (
    <PlanetCashContext.Provider
      value={{
        accounts,
        isPlanetCashActive,
        setAccounts,
        setIsPlanetCashActive,
        updateAccount,
      }}
    >
      {children}
    </PlanetCashContext.Provider>
  );
};

export const usePlanetCash = (): PlanetCashContextInterface => {
  const context = useContext(PlanetCashContext);
  if (!context) {
    throw new Error('PlanetCashContext must be used within PlanetCashProvider');
  }
  return context;
};
