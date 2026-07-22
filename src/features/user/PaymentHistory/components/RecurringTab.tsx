import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '@/features/common/types/payments';

import { useCallback, useEffect, useRef, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import Recurrency from '@/features/user/Account/Recurrency';
import { useApi } from '@/hooks/useApi';
import { useUserProps } from '@/features/common/Layout/UserPropsContext';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

/**
 * Recurring-donations tab of the Payments hub. Reuses the existing
 * Account/Recurrency feature (GET /app/subscriptions), mirroring the fetch the
 * standalone /profile/recurrency page does, minus its DashboardView wrapper.
 * A shadcn redesign of this feature can come later.
 */
export const RecurringTab = () => {
  const { getApiAuthenticated } = useApi();
  const { token, contextLoaded } = useUserProps();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const apiRef = useRef(getApiAuthenticated);
  apiRef.current = getApiAuthenticated;
  const setErrorsRef = useRef(setErrors);
  setErrorsRef.current = setErrors;
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [recurrencies, setRecurrencies] = useState<Subscription[] | undefined>(
    undefined
  );

  const fetchRecurrentDonations = useCallback(async () => {
    if (!tokenRef.current) return;
    setIsDataLoading(true);
    try {
      const res = await apiRef.current<Subscription[]>('/app/subscriptions');
      setRecurrencies(res);
    } catch (err) {
      setErrorsRef.current(handleError(err as APIError));
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (contextLoaded && token) fetchRecurrentDonations();
  }, [contextLoaded, token, fetchRecurrentDonations]);

  return (
    <Recurrency
      isDataLoading={isDataLoading}
      recurrencies={recurrencies}
      fetchRecurrentDonations={fetchRecurrentDonations}
    />
  );
};
