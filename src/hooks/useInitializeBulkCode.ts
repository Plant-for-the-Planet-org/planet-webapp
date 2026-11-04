import { useEffect } from 'react';
import { useBulkCodeStore, useUserStore } from '../stores';

/**
 * Bulk codes data (planet cash account, project list) belongs to a single user profile, so the store is re-initialized whenever that profile changes.
 * `profileId` changes on first load, on login, on logout, and when entering or leaving impersonation.
 */
export const useInitializeBulkCode = () => {
  const profileId = useUserStore((state) => state.userProfile?.id);
  const resetBulkCodeStore = useBulkCodeStore(
    (state) => state.resetBulkCodeStore
  );

  useEffect(() => {
    resetBulkCodeStore();
  }, [profileId, resetBulkCodeStore]);
};
