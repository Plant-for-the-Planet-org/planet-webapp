import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';

export default function ContentSection() {
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h2>VTO Fitness-for-a-Cause Challenge Sponsored by Earthforce</h2>
            <p className={styles.contentSectionSubhead}>
              April is Earthforce Champion Month, and we are inviting Salesforce
              colleagues around the world to log their minutes of humanpowered
              movement and exercise to champion Salesforce’s commitment to
              support and mobilize the conservation, restoration, and growth of
              100 Million trees as a part of the{' '}
              <a href="https://www.1t.org/" target="_blank" rel="noreferrer">
                1t.org
              </a>{' '}
              global trillion tree movement!
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
          >
            <img
              src="/tenants/salesforce/images/illustration-1.png"
              className={gridStyles.illustration1}
              alt=""
            />
          </div>
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
          >
            <h3>How you can participate</h3>
            <p>
              To join, donate $50 or more to a tree planting project of your
              choosing, submit your Salesforce Donation Match Request, and
              commit to consistent exercise of any type throughout the month of
              April.
            </p>
            <p>
              Participants who complete these steps are able to earn up to one
              hour of VTO per day (30 hours max) in April for their support of
              this challenge while competing with and encouraging colleagues
              from around the world to double down on sustainability and their
              own fitness.
            </p>
            <p>
              Join this challenge by making your tree donation below, choosing a
              tree planting project that resonates most with you, and let’s get
              moving towards a greener tomorrow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
