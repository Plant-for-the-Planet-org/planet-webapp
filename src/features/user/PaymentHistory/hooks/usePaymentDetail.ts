import type { APIError } from '@planet-sdk/common';
import type { PaymentDetail } from '../types';

import { useEffect, useRef, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import { useApi } from '@/hooks/useApi';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

export interface UsePaymentDetailResult {
  detail: PaymentDetail | null;
  isLoading: boolean;
  error: unknown;
}

/**
 * Lazily fetches a single payment from GET /app/payments/{guid}.
 * Pass `null` to skip fetching (e.g. when no row is open).
 */
export const usePaymentDetail = (
  guid: string | null
): UsePaymentDetailResult => {
  const { getApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const apiRef = useRef(getApiAuthenticated);
  apiRef.current = getApiAuthenticated;
  const setErrorsRef = useRef(setErrors);
  setErrorsRef.current = setErrors;

  const [detail, setDetail] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!guid) {
      setDetail(null);
      setError(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    apiRef
      .current<PaymentDetail>(`/app/payments/${guid}`)
      .then((res) => {
        if (requestId !== requestIdRef.current) return;
        setDetail(res);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
        setErrorsRef.current(handleError(err as APIError));
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, [guid]);

  return { detail, isLoading, error };
};
