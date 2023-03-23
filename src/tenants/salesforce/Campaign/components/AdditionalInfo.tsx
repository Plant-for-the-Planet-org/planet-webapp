import styles from './../styles/AdditionalInfo.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function AdditionalInfo() {
  return (
    <section className={styles.additionalInfoSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>More about the cause:</h3>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <p>
              In January 2020, as a founding partner of 1t.org, Salesforce
              announced our own goal to support and mobilize the conservation,
              restoration, and growth of 100 million trees by the end of 2030.
              In our FY24 Corporate V2MOM, Salesforce aims to reach 50% of this
              goal - 50 million trees - by year end. This challenge is in
              support of this initiative all while encouraging greater health
              and wellness among our amazing employees and providing a chance to
              earn VTO by exercising for the cause.
            </p>
            <p>
              Our partner in this, Plant for the Planet, connects our funding
              with tree planting projects all over the world. Together, we can
              help create a greener and cleaner future by moving toward 100
              million trees.
            </p>
          </div>
        </div>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>More About Fitness-For-A-Cause Challenges</h3>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <p>
              The primary goal of Fitness-for-a-Cause is to raise funds for
              various charitable organizations while encouraging consistent
              physical activity, improved health and wellness, and providing a
              fun way to compete and connect with colleagues across the world.
            </p>
            <p>
              Since 2020, Salesforce employees have raised over $300,000 dollars
              through Fitness-for-a-Cause challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
