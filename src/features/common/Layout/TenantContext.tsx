import { createContext, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const TenantContext = createContext({
  tenantID: '' || null,
  setTenantID: (value: string) => '',
});

const TenantContextProvider = ({ children }: any): ReactElement => {
  const [tenantID, setTenantID] = useState(null);
  const router = useRouter();

  const getTenantID = (router: {}) => {
    if (process.env.TENANTID) {
      return process.env.TENANTID;
    } else if (router.query.tenant) {
      return router.query.tenant;
    } else {
      return 'ten_NxJq55pm';
    }
  };

  useEffect(() => {
    const tenantId = getTenantID(router);
    setTenantID(tenantId);
  }, [router]);
  return (
    <TenantContext.Provider value={{ tenantID, setTenantID }}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantContextProvider;
