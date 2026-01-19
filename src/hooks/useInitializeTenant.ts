import type { Tenant } from '@planet-sdk/common';

import { useEffect } from 'react';
import { useTenantStore } from '../stores/tenantStore';
import { storeConfig } from '../utils/storeConfig';

export const useInitializeTenant = (tenantConfig: Tenant) => {
  const setTenantConfig = useTenantStore((state) => state.setTenantConfig);
  const isInitialized = useTenantStore((state) => state.isInitialized);

  useEffect(() => {
    // Prevent re-initializing the tenant store on re-renders or client-side route changes.
    // Tenant config should be set only once per app lifecycle.
    if (isInitialized) return;

    storeConfig(tenantConfig);
    setTenantConfig(tenantConfig);
  }, [tenantConfig, setTenantConfig, isInitialized]);
};
