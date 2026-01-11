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
                    <li>
                      Join the global community working to protect and restore
                      mangroves today by joining the{' '}
                      <a
                        href="https://www.1t.org/"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        trillion trees initiative
                      </a>
                      and supporting the{' '}
                      <a
                        href="https://www.mangrovebreakthrough.com/"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Mangrove Breakthrough
                      </a>
                      .
                    </li>
                    <li>
                      <strong>Donate directly</strong> to one of the projects
                      below
                    </li>
                    <li>
                      Become an early adopter of the{' '}
                      <a
                        href="https://oceanriskalliance.org/resource/high-quality-blue-carbon-principles-and-guidance-2/"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        High Quality Blue Carbon Principles and Guidance
                      </a>
                      .
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
                gridStyles.col12,
                styles.blueCarbonImage
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
              <h3>Unlocking the value of blue carbon.</h3>
              <p>
                Beyond our direct support for restoration, Salesforce is working
                to scale the flow of finance to the world’s most critical
                coastal ecosystems. &ldquo;Blue carbon&rdquo; is the carbon
                naturally stored in coastal habitats like mangrove forests, salt
                marshes, and seagrass beds. By protecting these areas, we create
                high-quality climate assets that can be valued and traded on the
                voluntary carbon market.
              </p>
              <p>
                Salesforce is leading by example, with a{' '}
                <a
                  href="https://www.salesforce.com/news/stories/nature-based-actions-cop30/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  goal to contract
                </a>{' '}
                for 1 million tons of high-quality blue carbon by 2030 to help
                accelerate this emerging market. To ensure these investments
                drive real impact, we co-sponsored the development of the{' '}
                <a
                  href="https://oceanriskalliance.org/resource/high-quality-blue-carbon-principles-and-guidance-2/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  High Quality Blue Carbon Principles and Guidance
                </a>
                . Combined with the Mangrove Breakthrough Principles, these
                standards guide our work and ensure that our mangrove
                initiatives deliver for the climate, for nature, and for
                communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
