import type { SetupIntentResponse } from '../types';

import { useCallback, useRef } from 'react';

import { useApi } from '@/hooks/useApi';

import { setupIntentIdFromSecret } from '../lib/savedPaymentMethod';

/**
 * Creates and cancels the SetupIntent behind "Add payment method":
 *   POST   /app/profile/paymentMethods/{country}/setupIntent
 *   DELETE /app/profile/paymentMethods/{country}/setupIntent/{id}
 * Errors are left to the caller, which decides whether to show them.
 */
export const useSetupIntent = (country: string | null) => {
  const { postApiAuthenticated, deleteApiAuthenticated } = useApi();
  const apiRef = useRef({ postApiAuthenticated, deleteApiAuthenticated });
  apiRef.current = { postApiAuthenticated, deleteApiAuthenticated };

  const createSetupIntent = useCallback(async () => {
    if (!country) throw new Error('No country to save a payment method for');
    return apiRef.current.postApiAuthenticated<SetupIntentResponse>(
      `/app/profile/paymentMethods/${country}/setupIntent`,
      { payload: {} }
    );
  }, [country]);

  const cancelSetupIntent = useCallback(
    async (clientSecret: string) => {
      if (!country) return;
      await apiRef.current.deleteApiAuthenticated(
        `/app/profile/paymentMethods/${country}/setupIntent/${setupIntentIdFromSecret(
          clientSecret
        )}`
      );
    },
    [country]
  );

  return { createSetupIntent, cancelSetupIntent };
};
