import type { Tenant } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TenantStore {
  tenantConfig: Tenant | null;
  setTenantConfig: (config: Tenant) => void;
}

export const useTenantStore = create<TenantStore>()(
  devtools(
    (set) => ({
      tenantConfig: null,

      setTenantConfig: (config) =>
        set(
          { tenantConfig: config },
          undefined,
          'tenantStore/init_tenant_config'
        ),
    }),
    {
      name: 'TenantStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
