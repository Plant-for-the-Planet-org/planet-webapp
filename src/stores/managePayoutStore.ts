import type {
  BankAccount,
  PayoutMinAmounts,
} from '../features/common/types/payouts';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ManagePayoutStore {
  accounts: BankAccount[] | null;
  setAccounts: (accounts: BankAccount[] | null) => void;
  payoutMinAmounts: PayoutMinAmounts | null;
  setPayoutMinAmounts: (payoutMinAmounts: PayoutMinAmounts | null) => void;
  resetManagePayoutStore: () => void;
}

const initialState = {
  accounts: null,
  payoutMinAmounts: null,
};

export const useManagePayoutStore = create<ManagePayoutStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setAccounts: (accounts) =>
        set({ accounts }, undefined, 'managePayout/set_accounts'),

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
