import type { PlanetCashAccount } from '../features/common/types/planetcash';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PlanetCashStore {
  // State
  planetCashAccounts: PlanetCashAccount[] | null;
  isPlanetCashActive: boolean;

  // Actions
  setPlanetCashAccounts: (accounts: PlanetCashAccount[] | null) => void;
  setIsPlanetCashActive: (isActive: boolean) => void;
  updateAccount: (updatedAccount: PlanetCashAccount) => void;
  resetPlanetCashStore: () => void;
}

const initialState = {
  planetCashAccounts: null,
  isPlanetCashActive: false,
};

export const usePlanetCashStore = create<PlanetCashStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setPlanetCashAccounts: (accounts) =>
        set(
          { planetCashAccounts: accounts },
          undefined,
          'planetCash/set_accounts'
        ),

      setIsPlanetCashActive: (isActive) =>
        set(
          { isPlanetCashActive: isActive },
          undefined,
          'planetCash/set_is_planet_cash_active'
        ),

      updateAccount: (updatedAccount) =>
        set(
          (state) => {
            if (!state.planetCashAccounts) return state;
            return {
              planetCashAccounts: state.planetCashAccounts.map((account) =>
                account.id === updatedAccount.id ? updatedAccount : account
              ),
            };
          },
          undefined,
          'planetCash/update_account'
        ),

      resetPlanetCashStore: () =>
        set(initialState, undefined, 'planetCash/reset_store'),
    }),
    {
      name: 'PlanetCashStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
