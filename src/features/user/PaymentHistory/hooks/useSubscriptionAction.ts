import type { APIError } from '@planet-sdk/common';

import { useCallback, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import { useApi } from '@/hooks/useApi';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

export type SubscriptionScope = 'modify' | 'pause' | 'cancel' | 'reactivate';

interface UseSubscriptionActionOptions {
  fetchRecurrentDonations: (next?: boolean) => void;
  /** Called after the request settles (success or error) — closes the modal. */
  onClose: () => void;
}

/**
 * Runs a recurring-donation mutation. All four actions hit the same endpoint,
 * `PUT /app/subscriptions/{id}`, differing only by `?scope=` and the payload
 * (mirrors the legacy MUI Edit/Pause/Cancel/Reactivate modals). On success the
 * modal closes and the list refetches; on error the modal closes and the error
 * is pushed to the global store — matching the old behavior.
 */
export const useSubscriptionAction = ({
  fetchRecurrentDonations,
  onClose,
}: UseSubscriptionActionOptions) => {
  const { putApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const run = useCallback(
    async (
      id: string,
      scope: SubscriptionScope,
      payload: Record<string, unknown>
    ) => {
      setIsSubmitting(true);
      try {
        await putApiAuthenticated(`/app/subscriptions/${id}`, {
          queryParams: { scope },
          payload,
        });
        onClose();
        fetchRecurrentDonations();
      } catch (err) {
        onClose();
        setErrors(handleError(err as APIError));
      } finally {
        setIsSubmitting(false);
      }
    },
    [putApiAuthenticated, setErrors, onClose, fetchRecurrentDonations]
  );

  return { isSubmitting, run };
};
