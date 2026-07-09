import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import clsx from 'clsx';

export default function ContentSection() {
  return (
    <section className={clsx(styles.contentSectionContainer)}>
      <div className={clsx(gridStyles.fluidContainer, styles.contentSection)}>
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.mb65100
          )}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <h3 className={styles.contentSectionHeader}>
              For Salesforce Employees
            </h3>
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
            <ul>
              <li>
                2026 challenge dates: April 1 - 30. All Salesforce employees
                worldwide are welcome to participate in this inclusive, global
                challenge.{' '}
                <strong>
                  SO if you are seeing this after April 30th - the challenge is
                  no longer in motion!
                </strong>
              </li>
              <li>
                To join, make a donation of $50 USD or more to{' '}
                <a href="https://salesforce.benevity.org/campaigns/19403/">
                  Plant-for-the-Planet On The Employee Impact Hub.
                </a>
              </li>
              <li>
                After donating, screenshot proof of donation and send to{' '}
                <a href="mailto:abilityforceATL@gmail.com">
                  abilityforceATL@gmail.com
                </a>{' '}
                for verification.
              </li>
              <li>
                Once verified, you’ll be added to a private Slack channel where
                you can log your exercise minutes and VTO hours throughout April
                2026.
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
