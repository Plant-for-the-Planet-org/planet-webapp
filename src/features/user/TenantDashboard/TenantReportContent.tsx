import type { CountryLeaderboardApi, RecentDonorApi, TenantStatsApi } from '.';

import CountryLeaderboard from './components/CountryLeaderboard';
import RecentDonors from './components/RecentDonors';
import TenantStats from './components/TenantStats';
import styles from './TenantDashboard.module.scss';

interface TenantReportContentProps {
  tenantStats: TenantStatsApi | null;
  countryLeaderboard: CountryLeaderboardApi[] | null;
  recentDonors: RecentDonorApi[] | null;
}

const TenantReportContent = ({
  tenantStats,
  countryLeaderboard,
  recentDonors,
}: TenantReportContentProps) => {
  return (
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
  );
};

export default TenantReportContent;
