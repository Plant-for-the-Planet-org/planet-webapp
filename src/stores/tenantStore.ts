import type { Tenant } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { defaultTenant } from '../../tenant.config';

interface TenantStore {
  tenantConfig: Tenant;
  isInitialized: boolean;
  setTenantConfig: (config: Tenant) => void;
}

export const useTenantStore = create<TenantStore>()(
  devtools(
    (set) => ({
      tenantConfig: defaultTenant,
      isInitialized: false,

      setTenantConfig: (config) =>
        set(
          { tenantConfig: config, isInitialized: true },
          undefined,
          'tenantStore/set_tenant_config'
        ),
    }),
    {
      name: 'TenantStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
