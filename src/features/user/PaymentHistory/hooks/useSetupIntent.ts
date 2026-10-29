import type { SetupIntentResponse } from '../types';

import { useCallback, useRef } from 'react';

import { useApi } from '@/hooks/useApi';

import { setupIntentIdFromSecret } from '../lib/savedPaymentMethod';

/** The SetupIntent behind "Add payment method", with what cancelling it needs. */
export interface OpenSetupIntent {
  clientSecret: string;
  accountCountry: string;
}

/**
 * Creates and cancels the SetupIntent behind "Add payment method":
 *   POST   /app/profile/paymentMethods/setupIntent
 *   DELETE /app/profile/paymentMethods/{accountCountry}/setupIntent/{id}
 * The platform picks the account, so cancelling uses the country it answered with.
 * Errors are left to the caller, which decides whether to show them.
 */
export const useSetupIntent = () => {
  const { postApiAuthenticated, deleteApiAuthenticated } = useApi();
  const apiRef = useRef({ postApiAuthenticated, deleteApiAuthenticated });
  apiRef.current = { postApiAuthenticated, deleteApiAuthenticated };

  const createSetupIntent = useCallback(
    () =>
      apiRef.current.postApiAuthenticated<SetupIntentResponse>(
        '/app/profile/paymentMethods/setupIntent',
        { payload: {} }
      ),
    []
  );

  const cancelSetupIntent = useCallback(
    async ({ clientSecret, accountCountry }: OpenSetupIntent) => {
      await apiRef.current.deleteApiAuthenticated(
        `/app/profile/paymentMethods/${accountCountry}/setupIntent/${setupIntentIdFromSecret(
          clientSecret
        )}`
      );
    },
    []
  );

  return { createSetupIntent, cancelSetupIntent };
};
