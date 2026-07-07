import type { StatItem } from '../TenantStats';

import styles from '../../TenantDashboard.module.scss';
import { clsx } from 'clsx';

const StatCard = ({ icon, value, label }: StatItem) => {
  return (
    <div
      className={clsx(styles.statCardBase, styles.statCard)}
      role="group"
      aria-label={`${value} ${label}`}
    >
      <span className={styles.statCardIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.statCardValue} aria-hidden="true">
        {value}
      </span>
      <span className={styles.statCardLabel} aria-hidden="true">
        {label}
      </span>
    </div>
  );
};

export default StatCard;
