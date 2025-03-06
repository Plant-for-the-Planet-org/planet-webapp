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
            <ul>
              <li>
                All Salesforce employees worldwide are eligible to participate
                in this inclusive challenge.
              </li>
              <li>
                To get started, make a donation of $50 USD or more to your
                chosen tree planting project from the provided list{' '}
                <a href="">below</a>. You&apos;ll receive a confirmation email
                from{' '}
                <a
                  href="https://www.plant-for-the-planet.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Plant-for-the-Planet
                </a>{' '}
                once your donation is processed.
              </li>
              <li>
                After donating, submit your Salesforce Donation Match request
                through the Employee Impact Hub, including your
                Plant-for-the-Planet receipt. Send screenshots of both your
                donation and match request to{' '}
                <a href="mailto:abilityforceATL@gmail.com">
                  abilityforceATL@gmail.com
                </a>{' '}
                for verification.
              </li>
              <li>
                Once verified, you&apos;ll be added to the Slack channel
                #vto-fitness-movetowards5miltrees-april25 where you can log your
                exercise minutes throughout April 2025.
              </li>
              <li>
                Participants can earn up to one hour of VTO per day during April
                (maximum 30 hours total). Exercise time converts to VTO at a 1:1
                ratio up to one hour - for example, 30 minutes of exercise
                equals 30 minutes of VTO. If you exercise for more than an hour,
                you can still only log one hour of VTO for that day.
              </li>
              <li>
                By participating, you&apos;re contributing to a healthier,
                cleaner, and greener future. Review the project list below to
                select a tree planting initiative that aligns with your values.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
