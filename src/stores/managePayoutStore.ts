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
}

export const useManagePayoutStore = create<ManagePayoutStore>()(
  devtools(
    (set) => ({
      accounts: null,
      payoutMinAmounts: null,

      setAccounts: (accounts) =>
        set({ accounts }, undefined, 'managePayout/set_accounts'),

      setPayoutMinAmounts: (payoutMinAmounts) =>
        set(
          { payoutMinAmounts },
          undefined,
          'managePayout/set_minimum_amounts'
        ),
    }),
    {
      name: 'ManagePayoutStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
