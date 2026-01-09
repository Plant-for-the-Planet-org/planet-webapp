import type { Tenant } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { defaultTenant } from '../../tenant.config';

interface TenantStore {
  tenantConfig: Tenant;
  setTenantConfig: (config: Tenant) => void;
}

export const useTenantStore = create<TenantStore>()(
  devtools(
    (set) => ({
      tenantConfig: defaultTenant,

      setTenantConfig: (config) =>
        set(
          { tenantConfig: config },
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
