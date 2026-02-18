import type { StatItem } from '../TenantStats';

import styles from '../../TenantDashboard.module.scss';

const StatCard = ({ icon, value, label }: StatItem) => {
  return (
    <section className={styles.statCard}>
      <span className={styles.statCardIcon}>{icon}</span>
      <span className={styles.statCardValue}>{value}</span>
      <span className={styles.statCardLabel}>{label}</span>
    </section>
  );
};

export default StatCard;
