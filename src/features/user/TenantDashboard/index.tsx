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
import RecentDonors from './components/RecentDonors';
import styles from './TenantDashboard.module.scss';

export interface RecentDonorInterface {
  units: number;
  unitType: 'tree' | 'm2';
  created: string;
  donor: string;
}

export interface CountryLeaderboardInterface {
  donor_country: CountryCode;
  trees: string;
}

export interface TenantStatsInterface {
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
  const [tenantStats, setTenantStats] = useState<TenantStatsInterface | null>(
    null
  );
  const [recentDonors, setRecentDonors] = useState<
    RecentDonorInterface[] | null
  >(null);
  const [countryLeaderboard, setCountryLeaderboard] = useState<
    CountryLeaderboardInterface[] | null
  >(null);
  const [isFetching, setIsFetching] = useState(false);

  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stats, donors, leaderboard] = await Promise.all([
          getApi<TenantStatsInterface>(
            `/app/tenantDashboard/${defaultTenant.id}/stats`
          ),
          getApi<RecentDonorInterface[]>(
            `/app/tenantDashboard/${defaultTenant.id}/mostRecent`
          ),
          getApi<CountryLeaderboardInterface[]>(
            `/app/tenantDashboard/${defaultTenant.id}/leaderboard`
          ),
        ]);

        setTenantStats(stats);
        setRecentDonors(donors);
        setCountryLeaderboard(leaderboard);
      } catch (error) {
        setErrors(handleError(error as APIError));
        router.push(localizedPath('/profile'));
      } finally {
        setIsFetching(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <section>
      <TenantStats tenantStats={tenantStats} />
      <section className={styles.dashboardLayout}>
        <CountryLeaderboard
          countries={countryLeaderboard}
          totalTreesPlanted={tenantStats?.global.totalPlanted}
        />
        {recentDonors && <RecentDonors recentDonors={recentDonors} />}
      </section>
    </section>
  );
};

export default TenantDashboard;
