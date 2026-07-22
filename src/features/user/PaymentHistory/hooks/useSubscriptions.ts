import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '@/features/common/types/payments';

import { useEffect, useRef, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import { useApi } from '@/hooks/useApi';
import { useUserProps } from '@/features/common/Layout/UserPropsContext';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

/**
 * Fetches the profile's recurring donations (GET /app/subscriptions). `enabled`
 * lets callers skip the request entirely (e.g. when it isn't needed to decide
 * something). Used to tell whether the donor is already a recurring supporter.
 */
export const useSubscriptions = (enabled = true) => {
  const { getApiAuthenticated } = useApi();
  const { token, contextLoaded } = useUserProps();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const apiRef = useRef(getApiAuthenticated);
  apiRef.current = getApiAuthenticated;
  const setErrorsRef = useRef(setErrors);
  setErrorsRef.current = setErrors;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled || !contextLoaded || !token) return;
    let active = true;
    setIsLoading(true);
    apiRef
      .current<Subscription[]>('/app/subscriptions')
      .then((res) => {
        if (active) setSubscriptions(res ?? []);
      })
      .catch((err) => {
        if (active) setErrorsRef.current(handleError(err as APIError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled, contextLoaded, token]);

  return { subscriptions, isLoading };
};
