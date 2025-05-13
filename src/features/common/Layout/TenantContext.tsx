import type { FC } from 'react';
import type { SetState } from '../types/common';
import type { WebTenant } from './Navbar/tenant';

import { useContext, createContext, useMemo, useState } from 'react';

interface TenantContextInterface {
  tenantConfig: WebTenant;
  setTenantConfig: SetState<WebTenant>;
}

const TenantContext = createContext<TenantContextInterface | null>(null);

interface TenantProviderProps {
  initialTenantConfig: WebTenant;
}

export const TenantProvider: FC<TenantProviderProps> = ({
  children,
  initialTenantConfig,
}) => {
  const [tenantConfig, setTenantConfig] =
    useState<WebTenant>(initialTenantConfig);

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
