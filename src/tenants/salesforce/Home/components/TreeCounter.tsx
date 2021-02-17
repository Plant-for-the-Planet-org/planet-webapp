import TreeCounter from '../../TreeCounter/TreeCounter';
import styles from './../styles/TreeCounter.module.scss';
import gridStyles from './../styles/Grid.module.scss'
interface Props {
  tenantScore: any;
}
export default function TreeCounterSection(tenantScore: Props) {
  const tenantScoreData = tenantScore.tenantScore
    ? tenantScore.tenantScore.total
    : '';
  return (
    <div className={gridStyles.fluidContainer}>
      <div className={`${gridStyles.gridRow} ${styles.treeCounterSectionRow}`}>
        <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${styles.treeCounterSectionText}`}>
          <h2 className={styles.treeCounterSectionTextHeader}>
            Getting to work.
          </h2>
          <p className={styles.treeCounterSectionTextPara}>
          Even though our journey is just starting, we know it will take the full power of Salesforce - including our technology, capital, influence, and network - to get there. And we know there’s no time to waste. We know we’ll have to refine our programs and methodology over time, by sharing with and learning from others. That’s why we’ve launched this resource.
            <br />
            <br />
Check out the “Donate” tab to see some of the places where we’re supporting tree planting organizations and lend your support! The tracker to the right and leaderboard below reflect all the donations made and registered on this platform. Also below, you’ll find examples of our other initiatives as well as resources to get involved. We’ll continue to add projects, programs, and resources so check back often!
          </p>
          {/* <button className={styles.buttonStyle}>Join Us</button> */}
        </div>
        <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${styles.treeCounterSection}`}>
          <div className={styles.treeCounterContainer}></div>
          <div className={styles.treeCounter}>
            <TreeCounter title={'trees supported by the Salesforce community through the projects on this platform'} planted={tenantScoreData} />
          </div>
          <img
            className={styles.treeCounterImage}
            src={'/tenants/salesforce/images/TreeCounterImage.png'}
            alt="Treecounter Image"
          />
        </div>
      </div>
    </div>
  );
}
