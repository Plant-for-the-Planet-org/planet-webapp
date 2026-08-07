import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import styles from '../TenantDashboard.module.scss';

const STAT_CARD_COUNT = 5;
const LEADERBOARD_ROW_COUNT = 10;
const DONOR_ROW_COUNT = 8;

const TenantDashboardSkeleton = () => {
  const t = useTranslations('Profile.tenant');

  return (
    <div role="status" aria-label={t('loadingDashboard')}>
      <div className={styles.tenantStatsContainer}>
        {Array.from({ length: STAT_CARD_COUNT }).map((_, i) => (
          <div
            key={i}
            className={clsx(styles.statCardBase, styles.statCard)}
            aria-hidden="true"
          >
            <Skeleton
              width={31}
              height={31}
              borderRadius={4}
              className={styles.statCardIcon}
            />
            <Skeleton width="60%" height={20} />
            <Skeleton width="80%" height={16} />
          </div>
        ))}
      </div>

      <div className={styles.dashboardLayout}>
        <div
          className={clsx(styles.card, styles.leaderboard)}
          aria-hidden="true"
        >
          <div className={styles.cardHeader}>
            <Skeleton width={31} height={31} borderRadius={4} />
            <Skeleton width={180} height={20} />
          </div>
          <div className={styles.leaderboardList}>
            {Array.from({ length: LEADERBOARD_ROW_COUNT }).map((_, i) => (
              <div key={i} className={styles.leaderboardRow}>
                <div className={styles.leaderboardRowHeader}>
                  <Skeleton width={120} height={14} />
                  <Skeleton width={60} height={14} />
                </div>
                <Skeleton height={6} borderRadius={999} />
              </div>
            ))}
          </div>
        </div>

        <div
          className={clsx(styles.card, styles.recentDonors)}
          aria-hidden="true"
        >
          <div className={styles.cardHeader}>
            <Skeleton width={31} height={31} borderRadius={4} />
            <Skeleton width={140} height={20} />
          </div>
          <ul>
            {Array.from({ length: DONOR_ROW_COUNT }).map((_, i) => (
              <li key={i} className={styles.donorRow}>
                <Skeleton width={140} height={14} />
                <Skeleton width={70} height={14} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardSkeleton;
