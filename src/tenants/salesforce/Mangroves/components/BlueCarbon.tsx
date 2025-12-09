import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/BlueCarbon.module.scss';
import { clsx } from 'clsx';

export default function BlueCarbon() {
  return (
    <div>
      <div className={styles.blueCarbonContainer}>
        <div className={clsx(gridStyles.fluidContainer, styles.blueCarbon)}>
          <div
            className={clsx(
              gridStyles.gridRow,
              gridStyles.justifyContentCenter,
              gridStyles.mb65100,
              styles.calloutContainer
            )}
          >
            <div
              className={clsx(
                gridStyles.col12,
                gridStyles.colMd8,
                styles.helpOutCallout
              )}
            >
              <div className={styles.calloutContentContainer}>
                <div className={styles.calloutContentOverlay}></div>
                <div className={styles.calloutContent}>
                  <h3>Join us</h3>
                  <ul>
                    Join the global community working to protect and restore
                    mangroves today:
                    <li>
                      Support the Mangrove Breakthrough with a{' '}
                      <strong>mangrove-focused pledge to 1t.org</strong>
                    </li>
                    <li>
                      <strong>Donate directly</strong> to one of the projects
                      below
                    </li>
                    <li>
                      Join the World Economic Forum{' '}
                      <a
                        href="https://www.weforum.org/friends-of-ocean-action/mangroves-working-group/"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Mangroves Working Group
                      </a>
                    </li>
                    <li>
                      Become an early adopter of the{' '}
                      <a
                        href="https://airtable.com/appEmTx9RhMTdf6Ku/shrfWHk7Km8jiGoXD"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        High Quality Blue Carbon Principles and Guidance
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
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
              <div className={gridStyles.circularContainer}>
                <img
                  src="/tenants/salesforce/images/mangroves/bahamas-mangroves.jpg"
                  alt="mangroves in the bahamas"
                />
              </div>
            </div>
            <div
              className={clsx(
                gridStyles.colMd6,
                gridStyles.colLg6,
                gridStyles.col12
              )}
            >
              <h3>Blue Carbon</h3>

              <p>
                In addition to direct support to projects and critical global
                initiatives, Salesforce has been working to scale the flow of
                finance to these critical coastal ecosystems. “Blue Carbon”
                refers to the carbon stored in coastal ecosystems, like mangrove
                forests, salt marshes, and seagrass beds, and is a commodity
                that can be monetized on the voluntary carbon market. Salesforce{' '}
                <a
                  href="https://www.salesforce.com/news/stories/salesforce-accelerates-commitment-to-trees-oceans-and-youth-programs-to-fight-climate-change/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  endeavors to purchase
                </a>{' '}
                1M tons of high quality blue carbon to help scale the market for
                the carbon sequestered in coastal ecosystems.
              </p>
              <p>
                As a first step, Salesforce co-sponsored the development of the{' '}
                <a
                  href="https://merid.org/wp-content/uploads/2022/11/HQBC-PG_FINAL_11.8.2022.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  High Quality Blue Carbon Principles and Guidance
                </a>{' '}
                which, together with the Mangrove Breakthrough Principles, guide
                all of our mangrove-related work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
