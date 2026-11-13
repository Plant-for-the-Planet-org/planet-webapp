import { useEffect } from 'react';
import { usePlanetCashStore, useUserStore } from '../stores';

/**
 * PlanetCash data belongs to a single user profile, so the store is re-initialized whenever that profile changes.
 * `profileId` changes on first load, on login, on logout, and when entering or leaving impersonation.
 */
export const useInitializePlanetCash = () => {
  const profileId = useUserStore((state) => state.userProfile?.id);
  const resetPlanetCashStore = usePlanetCashStore(
    (state) => state.resetPlanetCashStore
  );

  useEffect(() => {
    resetPlanetCashStore();
  }, [profileId, resetPlanetCashStore]);
};
