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
import DateRangePicker from './components/DateRangePicker';
import { useTranslations } from 'next-intl';
import { formatDate, isDataEmpty, isValidRange } from './utils';
import { clsx } from 'clsx';

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
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const today = new Date();
  const t = useTranslations('Profile.tenant');

  // Build query string from date state
  const buildDateParams = (since: Date | null, till: Date | null): string => {
    const params = new URLSearchParams();
    if (since) params.set('since', formatDate(since));
    if (till) params.set('till', formatDate(till));
    return params.toString() ? `?${params.toString()}` : '';
  };

  const fetchTenantReport = async (since: Date | null, till: Date | null) => {
    setIsFetching(true);
    const dateParams = buildDateParams(since, till);
    try {
      const [stats, donors, leaderboard] = await Promise.all([
        getApi<TenantStatsInterface>(
          `/app/tenantDashboard/${defaultTenant.id}/stats${dateParams}`
        ),
        getApi<RecentDonorInterface[]>(
          `/app/tenantDashboard/${defaultTenant.id}/mostRecent${dateParams}`
        ),
        getApi<CountryLeaderboardInterface[]>(
          `/app/tenantDashboard/${defaultTenant.id}/leaderboard${dateParams}`
        ),
      ]);

      setTenantStats(stats);
      setIsEmptyResult(isDataEmpty(stats.global));
      setRecentDonors(donors);
      setCountryLeaderboard(leaderboard);
    } catch (error) {
      setErrors(handleError(error as APIError));
      router.push(localizedPath('/profile'));
    } finally {
      setIsFetching(false);
    }
  };

  const handleApply = (fromDate: Date | null, toDate: Date | null) => {
    if (!isValidRange(fromDate, toDate)) return;
    fetchTenantReport(fromDate, toDate);
  };

  useEffect(() => {
    fetchTenantReport(null, null);
  }, []);

  return (
    <section>
      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        today={today}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onApply={handleApply}
      />

      {isEmptyResult && (
        <div className={clsx(styles.card, styles.emptyState)}>
          <p>{t('noDataForRange')}</p>
        </div>
      )}

      {!isEmptyResult && (
        <>
          <TenantStats tenantStats={tenantStats} />
          <section className={styles.dashboardLayout}>
            <CountryLeaderboard
              countries={countryLeaderboard}
              totalTreesPlanted={tenantStats?.global.totalPlanted}
            />
            {recentDonors && <RecentDonors recentDonors={recentDonors} />}
          </section>
        </>
      )}
    </section>
  );
};

export default TenantDashboard;
