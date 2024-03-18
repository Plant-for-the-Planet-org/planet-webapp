import styles from './../styles/Landing.module.scss';
import TreeCounter from '../../TreeCounter/TreeCounter';

interface Props {
  tenantScore?: { total: number };
}
export default function Landing({ tenantScore }: Props) {
  const tenantScoreData = tenantScore ? tenantScore.total : 0;
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingOverlay}></div>
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>Mangroves We Helped To Conserve Restore And Grow</h3>
          <TreeCounter
            planted={tenantScoreData || 0}
            isLight={true}
            shouldShowMillions={true}
          />
        </div>
      </div>
    </section>
  );
}
