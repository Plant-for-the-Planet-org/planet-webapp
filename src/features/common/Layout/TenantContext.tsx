import { useContext, createContext, useMemo, useState, FC } from 'react';

import { SetState } from '../types/common';
import { TenantAppConfig } from '@planet-sdk/common/build/types/tenant';

interface TenantContextInterface {
  tenantConfig: TenantAppConfig | null;
  setTenantConfig: SetState<TenantAppConfig | null>;
}

const TenantContext = createContext<TenantContextInterface | null>(null);

export const TenantProvider: FC = ({ children }) => {
  const [tenantConfig, setTenantConfig] = useState<TenantAppConfig | null>(
    null
  );

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
