import { useEffect } from 'react';
import { useManagePayoutStore, useUserStore } from '../stores';

/**
 * Payout data belongs to a single user profile, so the store is re-initialized whenever that profile changes.
 * `profileId` changes on first load, on login, on logout, and when entering or leaving impersonation.
 */
export const useInitializePayout = () => {
  const profileId = useUserStore((state) => state.userProfile?.id);
  const resetManagePayoutStore = useManagePayoutStore(
    (state) => state.resetManagePayoutStore
  );

  useEffect(() => {
    resetManagePayoutStore();
  }, [profileId, resetManagePayoutStore]);
};
