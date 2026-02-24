import type { StatItem } from '../TenantStats';

import styles from '../../TenantDashboard.module.scss';
import { clsx } from 'clsx';

const StatCard = ({ icon, value, label }: StatItem) => {
  return (
    <section className={clsx(styles.statCardBase, styles.statCard)}>
      <span className={styles.statCardIcon}>{icon}</span>
      <span className={styles.statCardValue}>{value}</span>
      <span className={styles.statCardLabel}>{label}</span>
    </section>
  );
};

export default StatCard;
