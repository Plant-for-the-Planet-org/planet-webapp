import { useEffect } from 'react';
import { usePlanetCashStore, useUserStore } from '../stores';

/**
 * Hook to handle PlanetCash store lifecycle.
 * Resets PlanetCash state when the user profile changes.
 */
export const useInitializePlanetCash = () => {
  const profileId = useUserStore((state) => state.userProfile?.id);
  const resetPlanetCashStore = usePlanetCashStore(
    (state) => state.resetPlanetCashStore
  );

  useEffect(() => {
    // Reset PlanetCash store on impersonation mode active
    resetPlanetCashStore();
  }, [profileId, resetPlanetCashStore]);
};
