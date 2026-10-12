import type { APIError } from '@planet-sdk/common';
import type { SavedPaymentMethod } from '../types';

import { useCallback, useEffect, useRef, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import { useApi } from '@/hooks/useApi';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

export interface UsePaymentMethodsResult {
  methods: SavedPaymentMethod[];
  isLoading: boolean;
  error: unknown;
  /** id of the method currently being removed, or null. */
  removingId: string | null;
  removeMethod: (id: string) => Promise<boolean>;
  reload: () => void;
}

/**
 * Lists and removes the profile's saved payment methods for a country via
 * GET/DELETE /app/profile/paymentMethods/{country}[/ {id}] (Bearer auth).
 * Adding a method is intentionally NOT here — it needs Stripe Elements, which
 * the webapp does not yet have (see the payment-history-redesign notes).
 */
export const usePaymentMethods = (
  country: string | null
): UsePaymentMethodsResult => {
  const { getApiAuthenticated, deleteApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const apiRef = useRef({ getApiAuthenticated, deleteApiAuthenticated });
  apiRef.current = { getApiAuthenticated, deleteApiAuthenticated };
  const setErrorsRef = useRef(setErrors);
  setErrorsRef.current = setErrors;

  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!country) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    apiRef.current
      .getApiAuthenticated<SavedPaymentMethod[]>(
        `/app/profile/paymentMethods/${country}`
      )
      .then((res) => {
        if (requestId !== requestIdRef.current) return;
        setMethods(res ?? []);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
        setErrorsRef.current(handleError(err as APIError));
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, [country, reloadToken]);

  const removeMethod = useCallback(
    async (id: string): Promise<boolean> => {
      if (!country) return false;
      setRemovingId(id);
      try {
        await apiRef.current.deleteApiAuthenticated(
          `/app/profile/paymentMethods/${country}/${id}`
        );
        setMethods((prev) => prev.filter((method) => method.id !== id));
        return true;
      } catch (err) {
        setErrorsRef.current(handleError(err as APIError));
        return false;
      } finally {
        setRemovingId(null);
      }
    },
    [country]
  );

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { methods, isLoading, error, removingId, removeMethod, reload };
};
