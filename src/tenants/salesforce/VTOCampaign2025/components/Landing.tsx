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
          <h3>Moving Toward 100 Million Trees</h3>
          {isLoaded && (
            <>
              <TreeCounter planted={tenantScoreData || 0} />
              <p>
                Since 2023, you have contributed towards over 62,500 trees
                through the VTO Fitness Challenge.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
