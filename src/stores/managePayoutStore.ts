import type {
  BankAccount,
  PayoutMinAmounts,
} from '../features/common/types/payouts';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AccountsFetchStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ManagePayoutStore {
  accounts: BankAccount[] | null;
  accountsStatus: AccountsFetchStatus;
  setAccounts: (accounts: BankAccount[] | null) => void;
  setAccountsStatus: (status: AccountsFetchStatus) => void;
  payoutMinAmounts: PayoutMinAmounts | null;
  setPayoutMinAmounts: (payoutMinAmounts: PayoutMinAmounts | null) => void;
  resetManagePayoutStore: () => void;
}

const initialState = {
  accounts: null,
  accountsStatus: 'idle' as AccountsFetchStatus,
  payoutMinAmounts: null,
};

export const useManagePayoutStore = create<ManagePayoutStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setAccounts: (accounts) =>
        set({ accounts }, undefined, 'managePayout/set_accounts'),

      setAccountsStatus: (accountsStatus) =>
        set({ accountsStatus }, undefined, 'managePayout/set_accounts_status'),

      setPayoutMinAmounts: (payoutMinAmounts) =>
        set(
          { payoutMinAmounts },
          undefined,
          'managePayout/set_minimum_amounts'
        ),

      resetManagePayoutStore: () =>
        set(initialState, undefined, 'managePayout/reset_store'),
    }),
    {
      name: 'ManagePayoutStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
