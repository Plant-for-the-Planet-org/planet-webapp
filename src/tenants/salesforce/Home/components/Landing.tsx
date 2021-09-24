import styles from './../styles/Landing.module.scss';
import TreeCounter from "../../TreeCounter/TreeCounter";
import Link from 'next/link';

interface Props {
  tenantScore: any;
}
export default function Landing(tenantScore: Props) {
  const tenantScoreData = tenantScore.tenantScore
    ? tenantScore.tenantScore.total
    : '';
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>Trees Conserved, Restored, and Grown</h3>
          <TreeCounter target={100000000} planted={tenantScoreData} />
          <p>Salesforce is committed to planting 100,000,000 trees by 2030.</p>
          <Link href="/">
            <button>Help us get there</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
