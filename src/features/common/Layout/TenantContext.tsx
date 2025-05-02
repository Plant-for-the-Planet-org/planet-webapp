import type { FC } from 'react';
import type { SetState } from '../types/common';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useContext, createContext, useMemo, useState } from 'react';

interface TenantContextInterface {
  tenantConfig: Tenant;
  setTenantConfig: SetState<Tenant>;
}

const TenantContext = createContext<TenantContextInterface | null>(null);

interface TenantProviderProps {
  initialTenantConfig: Tenant;
}

export const TenantProvider: FC<TenantProviderProps> = ({
  children,
  initialTenantConfig,
}) => {
  const [tenantConfig, setTenantConfig] = useState<Tenant>(initialTenantConfig);

  const value: TenantContextInterface | null = useMemo(
    () => ({
      tenantConfig,
      setTenantConfig,
    }),
    [tenantConfig, setTenantConfig]
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextInterface => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('TenantContext must be used within TenantProvider');
  }
  return context;
};
