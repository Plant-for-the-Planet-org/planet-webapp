import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import clsx from 'clsx';

/* cspell:ignore treesapr23 */

export default function ContentSection() {
  return (
    <div className={styles.contentSectionContainer}>
      <div className={clsx(gridStyles.fluidContainer, styles.contentSection)}>
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.mb65100
          )}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <h2>For Salesforce Employees</h2>
            <h2>VTO Fitness-for-a-Cause Challenge, Sponsored by Earthforce</h2>
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
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.mb65100
          )}
        >
          <div
            className={clsx(
              gridStyles.colMd6,
              gridStyles.colLg3,
              gridStyles.col12
            )}
          >
            <img
              src="/tenants/salesforce/images/illustration-1.png"
              className={gridStyles.illustration1}
              alt=""
            />
          </div>
          <div
            className={clsx(
              gridStyles.colMd6,
              gridStyles.colLg6,
              gridStyles.col12,
              styles.justifyContentCenter
            )}
          >
            <h3>How you can participate</h3>
            <p>
              All Salesforce employees globally are eligible to participate in
              this challenge.
            </p>
            <p>
              To join, donate $50 or more to a tree planting project of your
              choice from the projects listed below. You will then receive a
              donation confirmation email from Plant-for-the-Planet.
            </p>
            <p>
              Next, request your Salesforce Donation Match in Volunteerforce and
              upload your confirmation from{' '}
              <a
                href="https://www.plant-for-the-planet.org/"
                target="_blank"
                rel="noreferrer"
              >
                Plant-for-the-Planet
              </a>
              . Once your donation and match request are verified, visit our
              slack channel #vto-fitness-moving-toward-100m-treesapr23 to log
              your exercise minutes from April 1st - 30th via the slack
              workflow, and share your thoughts, insights and workouts!
            </p>
            <p>
              Participants in this challenge are able to earn up to one hour of
              VTO per day in April (30 hours max).
            </p>
            <p>
              Thank you for your interest and support. Continue below to choose
              a tree planting project that resonates most with you and make your
              impact. Let’s get moving towards a healthier and greener tomorrow!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
