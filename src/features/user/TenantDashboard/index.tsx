import type { APIError, CountryCode } from '@planet-sdk/common';

import { useEffect, useState } from 'react';
import TenantStats from './components/TenantStats';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { defaultTenant } from '../../../../tenant.config';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import CountryLeaderboard from './components/CountryLeaderboard';

export interface TenantStatsData {
  global: Global;
  countries: Country[];
}

export interface Global {
  tenant: string;
  totalDonated: number;
  totalPlanted: number;
  totalRestored: number;
  countries: number;
  uniqueDonors: number;
  currency: string;
}

export interface Country {
  country: CountryCode;
  trees: number;
}

const TenantDashboard = () => {
  const [tenantStats, setTenantStats] = useState<TenantStatsData | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const fetchTenantStats = async () => {
    setIsFetching(true);
    try {
      const stats = await getApi<TenantStatsData>(
        `/app/tenantDashboard/${defaultTenant.id}/stats`
      );
      setTenantStats(stats);
    } catch (error) {
      setErrors(handleError(error as APIError));
      router.push(localizedPath('/profile'));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTenantStats();
  }, []);

  return (
    <section>
      <TenantStats tenantStats={tenantStats} />
      <CountryLeaderboard
        countries={tenantStats?.countries}
        totalTreesPlanted={tenantStats?.global.totalPlanted}
      />
    </section>
  );
};

export default TenantDashboard;
