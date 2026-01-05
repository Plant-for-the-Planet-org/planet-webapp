import type { SerializedError } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorRedirect } from '../hooks/useErrorRedirect';

interface ErrorHandlingStore {
  errors: SerializedError[] | null;
  setErrors: (errors: SerializedError[] | null) => void;
  redirect: (url: string) => void;
}

export const useErrorHandlingStore = create<ErrorHandlingStore>()(
  devtools(
    (set) => ({
      errors: null,

      setErrors: (errors) => set({ errors }),

      clearErrors: () => set({ errors: null }),

      redirect: useErrorRedirect(),
    }),
    {
      name: 'ErrorHandlingStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
