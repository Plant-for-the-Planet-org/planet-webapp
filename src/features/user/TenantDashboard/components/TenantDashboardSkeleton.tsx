import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../TenantDashboard.module.scss';

const TenantDashboardSkeleton = () => {
  return (
    <section className={styles.tenantDashboard}>
      <div className={styles.tenantStatsContainer}>
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className={styles.statCardBase}>
              <Skeleton
                width="100%"
                height={100}
                className={styles.skeletonBlock}
              />
            </div>
          ))}
      </div>

      <div className={styles.dashboardLayout}>
        <div className={styles.leaderboard}>
          <Skeleton
            width="100%"
            height={391}
            className={styles.skeletonBlock}
          />
        </div>
        <div className={styles.recentDonors}>
          <Skeleton
            width="100%"
            height={391}
            className={styles.skeletonBlock}
          />
        </div>
      </div>
    </section>
  );
};
export default TenantDashboardSkeleton;
