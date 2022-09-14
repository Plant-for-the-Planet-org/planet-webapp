import { createContext, FC, useState, useContext } from 'react';

interface PlanetCashContextInterface {
  accounts: PlanetCash.Account[] | null;
  setAccounts: (accounts: PlanetCash.Account[] | null) => void;
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: (isPlanetCashActive: boolean) => void;
}

export const PlanetCashContext =
  createContext<PlanetCashContextInterface | null>(null);

export const PlanetCashProvider: FC = ({ children }) => {
  const [accounts, setAccounts] = useState<PlanetCash.Account[] | null>(null);
  const [isPlanetCashActive, setIsPlanetCashActive] = useState<boolean>(false);

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
