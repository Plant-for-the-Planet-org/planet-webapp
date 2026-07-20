import type { APIError } from '@planet-sdk/common';
import type {
  CountryLeaderboardApi,
  RecentDonorApi,
  TenantStatsApi,
} from './types';

import { useEffect, useRef, useState } from 'react';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import styles from './TenantDashboard.module.scss';
import { formatDate, isDataEmpty, isValidRange } from './utils';
import TenantReportContent from './TenantReportContent';
import TenantDashboardSkeleton from './components/TenantDashboardSkeleton';
import EmptyStateInfo from './components/microComponents/EmptyStateInfo';
import TenantReportControls from './TenantReportControls';
import DateRangeInfo from './components/microComponents/DateRangeInfo';
import { useUserProps } from '../../common/Layout/UserPropsContext';

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
  const latestRequestIdRef = useRef(0);

  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { user } = useUserProps();

  // Build query string from date state
  const buildDateParams = (since: Date | null, till: Date | null): string => {
    const params = new URLSearchParams();
    if (since) params.set('since', formatDate(since));
    if (till) params.set('till', formatDate(till));
    return params.toString() ? `?${params.toString()}` : '';
  };

  const fetchTenantReport = async (since: Date | null, till: Date | null) => {
    const tenantId = user?.tenantId;
    if (!tenantId) {
      setIsFetching(false);
      return;
    }

    // Bump request ID to track the latest API call
    latestRequestIdRef.current++;
    const currentRequestId = latestRequestIdRef.current;

    setIsFetching(true);
    const dateParams = buildDateParams(since, till);

    try {
      const [stats, donors, leaderboard] = await Promise.all([
        getApi<TenantStatsApi>(
          `/app/tenantDashboard/${tenantId}/stats${dateParams}`
        ),
        getApi<RecentDonorApi[]>(
          `/app/tenantDashboard/${tenantId}/mostRecent${dateParams}`
        ),
        getApi<CountryLeaderboardApi[]>(
          `/app/tenantDashboard/${tenantId}/leaderboard${dateParams}`
        ),
      ]);

      // Only apply results if this is still the latest request
      if (currentRequestId !== latestRequestIdRef.current) return;

      setTenantStats(stats);
      setIsEmptyResult(isDataEmpty(stats.global));
      setRecentDonors(donors);
      setCountryLeaderboard(leaderboard);
    } catch (error) {
      // Prevent outdated error responses from affecting UI
      if (currentRequestId !== latestRequestIdRef.current) return;

      setErrors(handleError(error as APIError));
      router.push(localizedPath('/profile'));
    } finally {
      // Only the latest request may clear the loading state
      if (currentRequestId === latestRequestIdRef.current) {
        setIsFetching(false);
      }
    }
  };

  const handleApply = (fromDate: Date | null, toDate: Date | null) => {
    if (!isValidRange(fromDate, toDate)) return;
    fetchTenantReport(fromDate, toDate);
  };

  useEffect(() => {
    fetchTenantReport(null, null);
  }, [user?.tenantId]);

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
      <div aria-live="polite" aria-busy={isFetching}>
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
      </div>
    </section>
  );
};

export default TenantDashboard;
