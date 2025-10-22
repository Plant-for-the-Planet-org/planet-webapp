import type { ReactNode } from 'react';
import type { PlanetCashAccount } from '../types/planetcash';

import { createContext, useState, useContext, useEffect } from 'react';
import { useUserProps } from './UserPropsContext';

interface PlanetCashContextInterface {
  accounts: PlanetCashAccount[] | null;
  setAccounts: (accounts: PlanetCashAccount[] | null) => void;
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: (isPlanetCashActive: boolean) => void;
}

export const PlanetCashContext =
  createContext<PlanetCashContextInterface | null>(null);

export const PlanetCashProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserProps();
  const [accounts, setAccounts] = useState<PlanetCashAccount[] | null>(null);
  const [isPlanetCashActive, setIsPlanetCashActive] = useState<boolean>(false);

  useEffect(() => {
    setAccounts(null);
    setIsPlanetCashActive(false);
  }, [user?.id]);

  return (
    <PlanetCashContext.Provider
      value={{
        accounts,
        isPlanetCashActive,
        setAccounts,
        setIsPlanetCashActive,
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
