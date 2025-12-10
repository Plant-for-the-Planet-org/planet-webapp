import styles from './../styles/Landing.module.scss';
import TreeCounter from '../../TreeCounter';
import Link from 'next/link';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

interface Props {
  tenantScore: any;
}
export default function Landing(tenantScore: Props) {
  const tenantScoreData = tenantScore.tenantScore
    ? tenantScore.tenantScore.total
    : '';
  const { localizedPath } = useLocalizedPath();
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingContent}>
        <div className={styles.landingContentTop}>
          <h3>Trees We Helped To Conserve, Restore, and Grow</h3>
          <TreeCounter planted={tenantScoreData} shouldShowMillions={true} />
          <p>
            Salesforce is helping to fund the conservation, restoration & growth
            of 100,000,000 trees by 2030.
          </p>
          <Link href={localizedPath('/')} className={styles.landingButton}>
            Help us get there
          </Link>
          <p className={styles.footnote}>
            This estimate is based on the amount of funding we provide, and
            progress reports we receive from our partner organizations. The
            estimate is updated regularly.
          </p>
        </div>
      </div>
    </section>
  );
}
