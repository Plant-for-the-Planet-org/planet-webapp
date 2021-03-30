import styles from './../styles/Landing.module.scss';
import TreeCounter from "../../TreeCounter/TreeCounter";
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
          <h1>Plant the Seeds for a More Sustainable Future</h1>
          <button>Start Planting</button>
        </div>
        <div className={styles.landingContentBottom}>
          <h3>Trees Conserved, Restored, and Grown</h3>
          <TreeCounter target={100000000} planted={tenantScoreData} />
          <p>This is Salesforce’s progress in achieving our goal of 100,000,000 trees by 2030.</p>
        </div>
      </div>
    </section>
  );
}
