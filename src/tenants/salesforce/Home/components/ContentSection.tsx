import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import clsx from 'clsx';

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
            <h2>This planet is our home and greatest opportunity.</h2>
            <p className={styles.contentSectionSubhead}>
              The path to a better world runs through our forests and oceans. At
              Salesforce, we’re leading the charge toward a nature positive
              future by reducing emissions and restoring the Earth’s most
              critical carbon sinks. From the Andes to the Outback, we’re
              working to ensure that our only home doesn&apos;t just survive —
              it thrives.
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
            <h3>Scaling the power of our forests.</h3>
            <p>
              Healthy forests are essential infrastructure for a flourishing
              planet. They are our greatest allies in preventing erosion and
              maintaining the vitality and wellbeing of our homes and
              communities. However, the scale of forest loss is a challenge we
              must meet head-on. With only 3 trillion trees remaining of the
              original 6 trillion, the mission is clear. Salesforce is committed
              to a nature-positive future, leading the charge to conserve and
              restore the ecosystems that sustain us all.
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
              gridStyles.colMd7,
              gridStyles.col12,
              gridStyles.orderSm1,
              gridStyles.orderMd0,
              styles.justifyContentCenter
            )}
          >
            <h3>Business is the greatest platform for change.</h3>
            <p>
              Salesforce is committed to a net zero, nature positive future.
              We’ve been on a sustainability journey for over a
              decade—minimizing energy usage, decarbonizing our operations, and
              innovating with AI to accelerate environmental progress. Our
              <a
                href="https://www.salesforce.com/content/dam/web/en_us/www/documents/white-papers/nature-positive-strategy.pdf"
                target="_blank"
                rel="noreferrer noopener"
              >
                Nature Positive Strategy
              </a>{' '}
              serves as our roadmap, guiding our efforts to lead restoration at
              scale and promote a world where nature and business thrive
              together.
            </p>
            <p>
              In January 2020, Salesforce became a founding partner of the{' '}
              <a
                href="https://www.1t.org/"
                target="_blank"
                rel="noreferrer noopener"
              >
                trillion trees initiative
              </a>
              . This global movement is dedicated to conserving, restoring, and
              growing healthy forest ecosystems by 2030. As part of this bold
              commitment, we set a goal to help fund the conservation,
              restoration, or growth of 100 million additional trees by the end
              of the decade. We’re proud of our progress so far, and we invite
              you to join us as a Trailblazer for our planet. We’re proud of our
              progress so far and remain committed to the work ahead.
            </p>
          </div>

          <div
            className={clsx(
              gridStyles.colMd3,
              gridStyles.col12,
              gridStyles.orderSm0,
              gridStyles.orderMd1
            )}
          >
            <img
              src="/tenants/salesforce/images/illustration-2.png"
              className={gridStyles.illustration2}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
