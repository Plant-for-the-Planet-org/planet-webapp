import styles from './../styles/Landing.module.scss';
import TreeCounter from '../../TreeCounter';

interface Props {
  tenantScore?: { total: number };
  isLoaded: boolean;
}
export default function Landing({ tenantScore, isLoaded }: Props) {
  const tenantScoreData = tenantScore ? tenantScore.total : 0;
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingOverlay}></div>
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>Mangroves We Helped To Conserve, Restore, And Grow</h3>
          {isLoaded && (
            <TreeCounter
              planted={tenantScoreData || 0}
              isLight={true}
              shouldShowMillions={true}
            />
          )}
        </div>
      </div>
    </section>
  );
}
