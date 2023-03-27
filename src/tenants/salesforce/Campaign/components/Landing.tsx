import styles from './../styles/Landing.module.scss';
import TreeCounter from '../../TreeCounter/TreeCounter';

interface Props {
  tenantScore?: { total: number };
}
export default function Landing({ tenantScore }: Props) {
  const tenantScoreData = tenantScore ? tenantScore.total : '';
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>MOVING Toward 100 Million Trees</h3>
          <TreeCounter target={100000000} planted={tenantScoreData} />
        </div>
      </div>
    </section>
  );
}
