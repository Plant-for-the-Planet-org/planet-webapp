import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '@/features/common/types/payments';

import { useCallback, useEffect, useRef, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import { useApi } from '@/hooks/useApi';
import { useUserProps } from '@/features/common/Layout/UserPropsContext';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

import { RecurringView } from './recurring/RecurringView';

/**
 * Recurring-donations tab of the Payments hub — a shadcn `RecurringView`
 * (record card + Edit/Pause/Cancel/Reactivate dialogs) over GET /app/subscriptions.
 * Replaced the legacy MUI Account/Recurrency page (now deleted).
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
    <RecurringView
      isDataLoading={isDataLoading}
      recurrencies={recurrencies}
      fetchRecurrentDonations={fetchRecurrentDonations}
    />
  );
};
