import type { Tenant } from '@planet-sdk/common';

import { useEffect } from 'react';
import { useTenantStore } from '../stores/tenantStore';
import { storeConfig } from '../utils/storeConfig';

export const useInitializeTenant = (tenantConfig: Tenant | undefined) => {
  const setTenantConfig = useTenantStore((state) => state.setTenantConfig);

  useEffect(() => {
    if (!tenantConfig) return;
    // Prevent re-initializing the tenant store on re-renders or client-side route changes.
    // Tenant config should be set only once per app lifecycle.
    //
    // Read live state rather than a subscribed snapshot: React's Strict Mode
    // double-invokes an effect on mount against that same render's closure, so a
    // snapshot `isInitialized` would still read `false` on the second invocation
    // even though `setTenantConfig` already flipped it during the first. That
    // let `storeConfig` fire twice, racing two geo lookups against each other.
    if (useTenantStore.getState().isInitialized) return;

    storeConfig(tenantConfig);

    setTenantConfig(tenantConfig);
  }, [tenantConfig, setTenantConfig]);
};
