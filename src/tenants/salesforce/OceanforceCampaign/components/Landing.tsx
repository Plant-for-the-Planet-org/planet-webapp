import styles from './../styles/Landing.module.scss';
import TreeCounter from '../../TreeCounter';

interface Props {
  tenantScore?: { total: number };
  isLoaded: boolean;
}
export default function Landing({ tenantScore, isLoaded }: Props) {
  const tenantScoreData = tenantScore ? tenantScore.total : '';
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingOverlay}></div>
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>Planting Hope & Growing Resilience with Mangroves</h3>
          {isLoaded && (
            <>
              <TreeCounter planted={tenantScoreData || 0} isLight={true} />
              <p>Mangroves Planted</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
