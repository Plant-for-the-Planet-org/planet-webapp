import type { APIError } from '@planet-sdk/common';
import type {
  CountryLeaderboardApi,
  RecentDonorApi,
  TenantStatsApi,
} from './types';

import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { defaultTenant } from '../../../../tenant.config';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import styles from './TenantDashboard.module.scss';
import { formatDate, isDataEmpty, isValidRange } from './utils';
import TenantReportContent from './TenantReportContent';
import TenantDashboardSkeleton from './components/TenantDashboardSkeleton';
import EmptyStateInfo from './components/microComponents/EmptyStateInfo';
import TenantReportControls from './TenantReportControls';
import DateRangeInfo from './components/microComponents/DateRangeInfo';

const TenantDashboard = () => {
  const [tenantStats, setTenantStats] = useState<TenantStatsApi | null>(null);
  const [recentDonors, setRecentDonors] = useState<RecentDonorApi[] | null>(
    null
  );
  const [countryLeaderboard, setCountryLeaderboard] = useState<
    CountryLeaderboardApi[] | null
  >(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  // Build query string from date state
  const buildDateParams = (since: Date | null, till: Date | null): string => {
    const params = new URLSearchParams();
    if (since) params.set('since', formatDate(since));
    if (till) params.set('till', formatDate(till));
    return params.toString() ? `?${params.toString()}` : '';
  };

  const fetchTenantReport = useCallback(
    async (since: Date | null, till: Date | null) => {
      setIsFetching(true);
      const dateParams = buildDateParams(since, till);

      try {
        const [stats, donors, leaderboard] = await Promise.all([
          getApi<TenantStatsApi>(
            `/app/tenantDashboard/${defaultTenant.id}/stats${dateParams}`
          ),
          getApi<RecentDonorApi[]>(
            `/app/tenantDashboard/${defaultTenant.id}/mostRecent${dateParams}`
          ),
          getApi<CountryLeaderboardApi[]>(
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
    },
    []
  );

  const handleApply = (fromDate: Date | null, toDate: Date | null) => {
    if (!isValidRange(fromDate, toDate)) return;
    fetchTenantReport(fromDate, toDate);
  };

  useEffect(() => {
    fetchTenantReport(null, null);
  }, [fetchTenantReport]);

  const isInitialLoad = !fromDate && !toDate;

  if (isFetching && isInitialLoad) {
    return <TenantDashboardSkeleton />;
  }

  return (
    <section className={styles.tenantDashboard}>
      {/* Only visible in print view */}
      {fromDate && toDate && (
        <DateRangeInfo fromDate={fromDate} toDate={toDate} />
      )}

      <TenantReportControls
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleApply={handleApply}
        isEmptyResult={isEmptyResult}
        isFetching={isFetching}
      />
      {isFetching ? (
        <TenantDashboardSkeleton />
      ) : isEmptyResult ? (
        <EmptyStateInfo />
      ) : (
        <TenantReportContent
          tenantStats={tenantStats}
          countryLeaderboard={countryLeaderboard}
          recentDonors={recentDonors}
        />
      )}
    </section>
  );
};

export default TenantDashboard;
