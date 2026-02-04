import type { Tenant } from '@planet-sdk/common';

import { useInitializeCurrency } from '../../../hooks/useInitializeCurrency';
import { useInitializeParams } from '../../../hooks/useInitializeParams';
import { useInitializeTenant } from '../../../hooks/useInitializeTenant';

interface StoreInitializerProps {
  tenantConfig?: Tenant;
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

export const StoreInitializer = ({ tenantConfig }: StoreInitializerProps) => {
  if (tenantConfig) useInitializeTenant(tenantConfig);
  useInitializeParams();
  useInitializeCurrency();
  return null;
};
