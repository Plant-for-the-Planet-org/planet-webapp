import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';

export default function ContentSection() {
  return (
    <section className={`${styles.contentSectionContainer}`}>
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
                2025 challenge dates: April 1 - 30. All Salesforce employees
                worldwide are welcome to participate in this inclusive, global
                challenge.
              </li>
              <li>
                To join, make a donation of $50 USD or more to a tree planting
                project from the provided list <a href="#projects">below</a>.
                You’ll receive a confirmation email from{' '}
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
                After donating, submit your Salesforce Donation Match Request
                (navigate to{' '}
                <a
                  href="https://salesforce.benevity.org/cause/840-383940108"
                  target="_blank"
                  rel="noreferrer"
                >
                  Plant-for-the-Planet
                </a>{' '}
                and click ‘Request A Match’). Upload your Plant-for-the-Planet
                receipt and submit your request. Email the pdf or screenshots of
                your donation AND match request to{' '}
                <a href="mailto:abilityforceATL@gmail.com">
                  abilityforceATL@gmail.com
                </a>{' '}
                for verification.
              </li>
              <li>
                Once verified, you’ll be added to a private Slack channel where
                you can log your exercise minutes throughout April 2025.
              </li>
              <li>
                Participants can earn two hours of VTO for simply joining the
                challenge by donating and exercising for the cause. Participants
                can also engage in climate-focused learning that will be posted
                in the channel for additional VTO hours. A maximum of 15 hours
                VTO will be offered for this month-long challenge.
              </li>
              <li>
                You will log your daily exercise minutes via the slack channel
                workflow and see where you stack up on the{' '}
                <a
                  href="https://docs.google.com/spreadsheets/d/1jfNNM636ng0QYrZWWEtbZwu77fxcyzevcpM09lD6Rx8/edit?gid=272653129#gid=272653129"
                  target="_blank"
                  rel="noreferrer"
                >
                  challenge leaderboard
                </a>
                . Prizes will be offered for those who come out on top! Please
                note, exercise minutes do not equal VTO hours.
              </li>
              <li>
                By participating, you’re contributing to a healthier, cleaner,
                and greener future for us all. Now, review the project list
                below and donate to a tree planting initiative that aligns with
                your interests!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
