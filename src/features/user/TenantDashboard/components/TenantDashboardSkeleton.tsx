import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../TenantDashboard.module.scss';

interface TenantDashboardSkeletonProps {
  count?: number;
  height?: number;
}

const TenantDashboardSkeleton = ({
  count = 15,
  height = 40,
}: TenantDashboardSkeletonProps) => {
  return (
    <div className={styles.tenantDashboardSkeleton}>
      <Skeleton count={count} height={height} style={{ marginBottom: 8 }} />
    </div>
  );
};
export default TenantDashboardSkeleton;
