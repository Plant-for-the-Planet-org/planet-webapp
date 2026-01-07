import type { SerializedError } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ErrorHandlingStore {
  errors: SerializedError[] | string | null;
  setErrors: (errors: SerializedError[] | string | null) => void;
}

export const useErrorHandlingStore = create<ErrorHandlingStore>()(
  devtools(
    (set) => ({
      errors: null,

      setErrors: (errors) =>
        set({ errors }, undefined, 'errorHandlingStore/set_errors'),

      clearErrors: () =>
        set({ errors: null }, undefined, 'errorHandlingStore/clear_errors'),
    }),
    {
      name: 'ErrorHandlingStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
