import type { Tenant } from '@planet-sdk/common';

import { useInitializeAuth } from '../../../hooks/useInitializeAuth';
import { useInitializeCurrency } from '../../../hooks/useInitializeCurrency';
import { useInitializeParams } from '../../../hooks/useInitializeParams';
import { useInitializeUser } from '../../../hooks/useInitializeUser';
import { useInitializeTenant } from '../../../hooks/useInitializeTenant';
import { useInitializeDonationReceipt } from '../../../hooks/useInitializeDonationReceipt';

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
  useInitializeTenant(tenantConfig);
  useInitializeParams();
  useInitializeAuth();
  useInitializeUser();
  useInitializeCurrency();
  useInitializeDonationReceipt();
  return null;
};
