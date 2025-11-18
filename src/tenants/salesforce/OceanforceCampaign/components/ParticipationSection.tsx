import { clsx } from 'clsx';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ParticipationSection.module.scss';

export default function ParticipationSection() {
  return (
    <div className={clsx(styles.participationSectionContainer)}>
      <div
        className={clsx(gridStyles.fluidContainer, styles.participationSection)}
      >
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.mb65100
          )}
        >
          <div
            className={clsx(
              gridStyles.colMd8,
              gridStyles.col12,
              styles.justifyContentCenter,
              styles.participationInfo
            )}
          >
            <h4>For Salesforce Employees:</h4>
            <ul>
              <li>
                To utilize the power of donation-matching, donate $50 or more to
                the Guatemala project. You will then receive a donation
                confirmation email from{' '}
                <a
                  href="https://www.plant-for-the-planet.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Plant-for-the-Planet
                </a>
                .
              </li>
              <li>
                Next, request your Salesforce Donation Match in{' '}
                <a
                  href="https://foundation.my.site.com/vfx/s/article/How-to-Request-a-Donation-Match"
                  target="_blank"
                  rel="noreferrer"
                >
                  Volunteerforce
                </a>{' '}
                and upload your confirmation from Plant-for-the-Planet.
              </li>
              <li>
                Can&apos;t donate $50? That&apos;s ok! Every dollar helps us
                reach our goal.
              </li>
            </ul>
          </div>
          {/* <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg4} ${gridStyles.col12}`}
          >
            {project !== null && (
              <div className={styles.projectItem}>
                <ProjectSnippet
                  project={project}
                  editMode={false}
                  displayPopup={false}
                  utmCampaign="oceanforce-2023"
                />
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
