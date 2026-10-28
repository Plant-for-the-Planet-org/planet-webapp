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
  /** True while waiting for a newly added method to appear in the list. */
  isSyncing: boolean;
  /** Resolves true once the method is listed, false if it did not appear in time. */
  waitForMethod: (id: string) => Promise<boolean>;
}

// The platform stores a new method when Stripe's webhook arrives, so it can be missing from the list for a few seconds after it was saved.
const SYNC_ATTEMPTS = 6;
const SYNC_DELAY_MS = 1500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lists and removes the profile's saved payment methods for a country via
 * GET/DELETE /app/profile/paymentMethods/{country}[/ {id}] (Bearer auth).
 * Adding a method lives in AddPaymentMethodDialog, which calls `waitForMethod` once Stripe has saved it.
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

  const [isSyncing, setIsSyncing] = useState(false);

  const waitForMethod = useCallback(
    async (id: string): Promise<boolean> => {
      if (!country) return false;
      setIsSyncing(true);
      try {
        for (let attempt = 0; attempt < SYNC_ATTEMPTS; attempt++) {
          if (attempt > 0) await wait(SYNC_DELAY_MS);
          const res = await apiRef.current
            .getApiAuthenticated<SavedPaymentMethod[]>(
              `/app/profile/paymentMethods/${country}`
            )
            .catch(() => null);
          if (res?.some((method) => method.id === id)) {
            // Drop any load still in flight so it cannot overwrite this list.
            requestIdRef.current++;
            setIsLoading(false);
            setMethods(res);
            return true;
          }
        }
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [country]
  );

  return {
    methods,
    isLoading,
    error,
    removingId,
    removeMethod,
    reload,
    isSyncing,
    waitForMethod,
  };
};
