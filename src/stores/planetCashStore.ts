import type { ApiConfigBase } from '../hooks/useApi';
import type { PlanetCashAccount } from '../features/common/types/planetcash';
import type { APIError } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { handleError } from '@planet-sdk/common';
import { useErrorHandlingStore } from './errorHandlingStore';

type PlanetCashFetchStatus = 'idle' | 'loading' | 'ready' | 'error';

interface PlanetCashStore {
  // State
  planetCashAccounts: PlanetCashAccount[] | null;
  isPlanetCashActive: boolean;
  status: PlanetCashFetchStatus;

  // Actions
  fetchPlanetCashAccounts: (
    getApiAuthenticated: <T>(
      url: string,
      config?: ApiConfigBase
    ) => Promise<T>
  ) => Promise<void>;
  setPlanetCashAccounts: (accounts: PlanetCashAccount[] | null) => void;
  setIsPlanetCashActive: (isActive: boolean) => void;
  updateAccount: (updatedAccount: PlanetCashAccount) => void;
  resetPlanetCashStore: () => void;
}

const sortAccountsByActive = (
  accounts: PlanetCashAccount[]
): PlanetCashAccount[] => {
  return accounts.sort((accountA, accountB) => {
    if (accountA.isActive === accountB.isActive) {
      return 0;
    } else {
      return accountA.isActive ? -1 : 1;
    }
  });
};

const initialState = {
  planetCashAccounts: null,
  isPlanetCashActive: false,
  status: 'idle' as PlanetCashFetchStatus,
};

export const usePlanetCashStore = create<PlanetCashStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchPlanetCashAccounts: async (getApiAuthenticated) => {
        // Guards against duplicate requests. Set before the `await`, so a second caller (e.g. React strict mode's double effect run) sees 'loading' and stops here.
        if (get().status !== 'idle') return;
        set({ status: 'loading' }, undefined, 'planetCash/fetch_start');
        try {
          const accounts = await getApiAuthenticated<PlanetCashAccount[]>(
            '/app/planetCash'
          );
          set(
            {
              planetCashAccounts: sortAccountsByActive(accounts),
              isPlanetCashActive: accounts.some((account) => account.isActive),
              status: 'ready',
            },
            undefined,
            'planetCash/fetch_success'
          );
        } catch (err) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(err as APIError));
          set({ status: 'error' }, undefined, 'planetCash/fetch_error');
        }
      },

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
