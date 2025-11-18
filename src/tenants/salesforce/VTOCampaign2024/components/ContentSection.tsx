import clsx from 'clsx';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';

// cspell:ignore vto-fitness-movetowards5miltrees-april24

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
            <h2>
              VTO Fitness-for-a-Cause Challenge, Sponsored by Earthforce and
              Abilityforce
            </h2>
            <p className={styles.contentSectionSubhead}>
              April is Earthforce Champion Month, and we are inviting Salesforce
              colleagues around the world to log their minutes of human-powered
              movement and exercise to champion Salesforce’s commitment to
              support and mobilize the conservation, restoration, and growth of
              5 Million trees this fiscal year as a part of the{' '}
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
              this inclusive challenge.
            </p>
            <p>
              To join, donate $50 (USD) or more to a tree planting project of
              your choice from the projects listed below on the page. Once your
              donation is completed, you will receive a donation confirmation
              email from{' '}
              <a
                href="https://www.plant-for-the-planet.org/"
                target="_blank"
                rel="noreferrer"
              >
                Plant-for-the-Planet
              </a>
              .
            </p>
            <p>
              Next, request your Salesforce Donation Match in the Employee
              Impact Hub and upload your receipt from Plant-for-the-Planet to
              request your match. Email screenshots of your donation AND match
              request to{' '}
              <a href="mailto:abilityforceATL@gmail.com">
                abilityforceATL@gmail.com
              </a>{' '}
              for verification. Once your donation and match request are
              verified, you will be added to the slack channel
              #vto-fitness-movetowards5miltrees-april24 to log your exercise
              minutes from April 1st - 30th via the slack workflow.
            </p>
            <p>
              Participants in this challenge are able to earn up to one hour of
              VTO per day in April (30 hours max) by participating in this
              fitness-for-a-cause challenge. For example, if you completed 30
              minutes of exercise, you can log 30 minutes of VTO. If you
              completed 2 hours of exercise, you can log 1 hour of VTO for that
              day.
            </p>
            <p>
              Thank you for your interest and support. Continue below to choose
              a tree planting project that resonates most with you and make your
              impact. Let’s get moving towards a healthier, cleaner, and greener
              tomorrow!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
