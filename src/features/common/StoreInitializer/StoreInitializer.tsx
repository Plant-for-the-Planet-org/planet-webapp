import { useInitializeCurrency } from '../../../hooks/useInitializeCurrency';
import { useInitializeParams } from '../../../hooks/useInitializeParams';
import { useInitializeProject } from '../../../hooks/useInitializeProject';
import { useInitializeIntervention } from '../../../hooks/useInitializeIntervention';
import { useInitializeView } from '../../../hooks/useInitializeView';
import { useInitializeSingleProject } from '../../../hooks/useInitializeSingleProject';

interface StoreInitializerProp {
  isMobile: boolean;
}

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

export const StoreInitializer = ({ isMobile }: StoreInitializerProp) => {
  useInitializeParams();
  useInitializeCurrency();
  useInitializeView(isMobile);
  useInitializeProject();
  useInitializeSingleProject();
  useInitializeIntervention();
  return null;
};
