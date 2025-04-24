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
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>MOVING Toward 5 Million Trees</h3>
          {isLoaded && (
            <>
              <TreeCounter planted={tenantScoreData || 0} />
              <p>
                This Challenge ended April 30th, thank you for your
                participation. Join us next year!
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
