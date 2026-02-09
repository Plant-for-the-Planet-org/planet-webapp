import { useInitializeAuth } from '../../../hooks/useInitializeAuth';
import { useInitializeCurrency } from '../../../hooks/useInitializeCurrency';
import { useInitializeParams } from '../../../hooks/useInitializeParams';
import { useInitializePlanetCash } from '../../../hooks/useInitializePlanetCash';
import { useInitializeUser } from '../../../hooks/useInitializeUser';

/**
 * StoreInitializer Component
 *
 * Initializes all Zustand stores on app startup.
 * Each feature has isolated initialization logic.
 *
 * Architecture:
 * - Store (state): src/stores/<featureName>.store.ts
 * - Hook (init):   src/hooks/useInitialize<FeatureName>.ts
 * - Component:     src/features/common/StoreInitializer/StoreInitializer.tsx
 */

export const StoreInitializer = () => {
  useInitializeParams();
  useInitializeAuth();
  useInitializeUser();
  useInitializeCurrency();
  useInitializePlanetCash();
  return null;
};
