// cspell:ignore costa-rica

import Link from 'next/link';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/SeaOfTrees.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { clsx } from 'clsx';

export default function SeaOfTrees() {
  const { localizedPath } = useLocalizedPath();
  return (
    <div>
      <div className={styles.seaOfTreesContainer}>
        <div className={clsx(gridStyles.fluidContainer, styles.seaOfTrees)}>
          <div
            className={clsx(
              gridStyles.gridRow,
              gridStyles.justifyContentCenter,
              gridStyles.mb65100
            )}
          >
            <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
              <h3>Healthy forests, thriving communities.</h3>
              <p className={styles.contentSectionSubhead}>Water Stewardship</p>
              <p>
                Water is the lifeblood of both natural ecosystems and business
                resilience. At Salesforce, high-quality water stewardship is
                essential to delivering our{' '}
                <a
                  href="https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/company/sustainability/salesforce-ai-sustainability-outlook.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  AI and software solutions sustainably
                </a>{' '}
                while advancing our{' '}
                <a
                  href="https://www.salesforce.com/content/dam/web/en_us/www/documents/white-papers/nature-positive-strategy.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Nature Positive Strategy
                </a>
                . We believe in protecting the watersheds that sustain us all,
                which is why we invest in local resilience to safeguard
                livelihoods and long-term well-being. By focusing on select
                regions where Salesforce has a business presence, we are
                doubling down on forest restoration that drives groundwater
                recharge, reduces runoff, and ensures clean water for our
                communities.
              </p>
              <p className={styles.contentSectionSubhead}>Mangroves:</p>
              <p>
                Mangroves are nature’s &ldquo;super trees&rdquo; — versatile
                champions that deliver massive impact for the planet, people,
                and local economies. These coastal powerhouses can store up to
                10x more carbon per hectare than terrestrial forests while
                providing a vital sanctuary for hundreds of threatened species.
                By sheltering the fish that coastal communities rely on for food
                security and acting as a natural buffer against storm surges,
                mangroves are a critical tool for global resilience.
              </p>
              <p>
                As part of our commitment to the{' '}
                <a
                  href="https://www.1t.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  trillion trees initiative
                </a>{' '}
                and our{' '}
                <a
                  href="https://www.salesforce.com/content/dam/web/en_us/www/documents/white-papers/nature-positive-strategy.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Nature Positive Strategy
                </a>
                , Salesforce proudly supports the{' '}
                <a
                  href="https://www.mangrovealliance.org/news/the-mangrove-breakthrough/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Mangrove Breakthrough
                </a>
                . This collective movement is building resilient coastal
                economies where nature serves as a primary ally for people. By
                helping to rewire global finance for mangroves, we are creating
                a blueprint for how the world invests in nature. We invite you
                to{' '}
                <a href={localizedPath('/mangroves')}>
                  explore Salesforce’s mangrove journey
                </a>{' '}
                and find your place in this global movement.
              </p>
              <Link
                href={localizedPath('/mangroves')}
                className={styles.learnMoreButton}
              >
                Learn More
              </Link>
            </div>
          </div>
          <div
            className={clsx(
              gridStyles.gridRow,
              gridStyles.justifyContentCenter,
              gridStyles.mb65100,
              styles.seaOfTreesImagesContainer
            )}
          >
            <div className={clsx(gridStyles.colMd3, gridStyles.col12)}>
              <img
                src="/tenants/salesforce/images/madagascar.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
            <div className={clsx(gridStyles.colMd3, gridStyles.col12)}>
              <img
                src="/tenants/salesforce/images/costa-rica.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
            <div className={clsx(gridStyles.colMd3, gridStyles.col12)}>
              <img
                src="/tenants/salesforce/images/kenya.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
          </div>
          <div
            className={clsx(
              gridStyles.gridRow,
              gridStyles.justifyContentCenter,
              gridStyles.mb65100
            )}
          >
            <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
              <hr />
            </div>
          </div>
          <div
            className={clsx(
              gridStyles.gridRow,
              gridStyles.justifyContentCenter,
              gridStyles.mb65100
            )}
          >
            <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
              <h3>How can you help?</h3>
              <p>
                <Link href={localizedPath('/')}>Click here</Link> to see what
                tree project you’d like to support. Then look for your donation
                on the Donation Tracker below and spread the word to your
                family, friends, and colleagues.
              </p>
              <h3>Resources</h3>
              <ul className={styles.resourceList}>
                <li>
                  Explore{' '}
                  <a
                    href="https://www.salesforce.com/sustainability/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Sustainability at Salesforce
                  </a>
                </li>
                <li>
                  Learn more about the{' '}
                  <a
                    href="https://www.1t.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    trillion trees movement
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
