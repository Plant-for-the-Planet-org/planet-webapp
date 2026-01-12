import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import Link from 'next/link';
import MangroveMapIcon from '../../../../../public/assets/images/icons/MangroveMapIcon';
import ViewIcon from '../../../../../public/assets/images/icons/ViewIcon';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { clsx } from 'clsx';

export default function ContentSection() {
  const { localizedPath } = useLocalizedPath();
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
          <div
            className={clsx(
              gridStyles.colMd8,
              gridStyles.col12,
              gridStyles.textCenter
            )}
          >
            <h3 className={styles.contentSectionSubhead}>
              The ultimate champions for climate, nature and people.
            </h3>
            <p className={styles.contentSectionBlurb}>
              Mangroves are nature’s high-performance ecosystem. While these
              forests cover less than 1% of the Earth’s landmass, they are
              incredibly efficient, storing up to 10 times more carbon per
              hectare than terrestrial forests. Beyond carbon, they are
              essential to global biodiversity, providing critical habitats for
              both marine and land species while acting as a vital nursery for
              juvenile fish. For climate-vulnerable communities, mangroves serve
              as a powerful first line of defense, functioning as a natural
              coastal barrier. Simply put, mangroves are one of nature’s
              greatest &ldquo;superheroes&rdquo; in the fight for a resilient
              future.
            </p>
          </div>
        </div>
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.mb65100,
            styles.mbIntro
          )}
        >
          <div
            className={clsx(
              gridStyles.colMd6,
              gridStyles.colLg3,
              gridStyles.col12,
              styles.introCTA
            )}
          >
            <div className={gridStyles.circularContainer}>
              <img
                src="/tenants/salesforce/images/mangroves/mangroves-indonesia.jpg"
                alt=""
              />
            </div>
            <Link
              href={localizedPath('/?filter=mangroves')}
              className={styles.projectMapButton}
            >
              <MangroveMapIcon /> View Project Map
            </Link>
            <Link href={'#project-grid'} className={styles.projectListButton}>
              <ViewIcon /> View Project List
            </Link>
          </div>
          <div
            className={clsx(
              gridStyles.colMd6,
              gridStyles.colLg6,
              gridStyles.col12,
              styles.justifyContentCenter
            )}
          >
            <h3>Scaling the Mangrove Breakthrough.</h3>
            <p>
              <em>
                This is part of our commitment to the{' '}
                <a
                  href="https://www.1t.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  trillion trees movement
                </a>{' '}
                and delivers on our Nature Positive Strategy.
              </em>
            </p>
            <p>
              The Mangrove Breakthrough is a global movement to value, finance,
              and safeguard these critical coastal ecosystems. It is pioneering
              how we, as a global community, protect nature to build resilient
              communities, financial systems, and economies. The ambition is
              bold: to mobilize $4 billion to protect and restore 15 million
              hectares of mangroves by 2030 by fostering radical collaboration
              and investing in local leadership.
            </p>
            <p>
              At Salesforce, we believe business is a platform for change, and
              these goals are within reach if we act together. As part of our
              commitment to the{' '}
              <a
                href="https://www.1t.org/"
                target="_blank"
                rel="noreferrer noopener"
              >
                trillion trees movement
              </a>{' '}
              and our Nature Positive Strategy, we’ve supported the
              establishment of the Mangrove Breakthrough Secretariat and the
              development of its Financial Roadmap.
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
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <p className={clsx(styles.contentSectionQuote, styles.bold)}>
              <em>
                “Mangroves are unparalleled in their role as a powerful climate
                solution, a bedrock of biodiversity, and a source of livelihood
                for millions of people around the world”{' '}
              </em>{' '}
              - Suzanne DiBianca, EVP and Chief Impact Officer at Salesforce
            </p>
          </div>
        </div>
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
              styles.justifyContentCenter,
              styles.mbCallout
            )}
          >
            <div className={styles.calloutContentContainer}>
              <div className={styles.calloutContentOverlay}></div>
              <div className={styles.calloutContent}>
                <h3>The Mangrove Breakthrough</h3>
                <p>
                  In partnership with{' '}
                  <a
                    href="https://plant-for-the-planet.org"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Plant-for-the-Planet
                  </a>
                  , we have invested in a diverse portfolio of restoration
                  projects — including{' '}
                  <a
                    href="https://blueventures.org/what-we-do/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Blue Ventures
                  </a>
                  ,{' '}
                  <a
                    href="https://www.wwf.mg/en/our_work/priority_places/mtb_landscape/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    World Wildlife Fund (WWF)
                  </a>
                  ,{' '}
                  <a
                    href="https://osaconservation.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Osa Conservation
                  </a>
                  ,{' '}
                  <a
                    href="https://onetreeplanted.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    One Tree Planted
                  </a>
                  ,{' '}
                  <a
                    href="https://oceanfdn.org/climate-resilience-on-the-coast-of-chiapas-mexico/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Fundación Mexicana para el Océano A.C.
                  </a>
                  ,{' '}
                  <a
                    href="https://www.perryinstitute.org/wp-content/uploads/2023/10/Mangrove-Report-Card-FINAL-interactive-.pdf"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Perry Institute of Marine Science
                  </a>
                  ,{' '}
                  <a
                    href="https://www.conservation.org/projects/surf-conservation"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Conservation International
                  </a>
                  , and the{' '}
                  <a
                    href="https://soatanzania.or.tz/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Sustainable Ocean Alliance Tanzania
                  </a>{' '}
                  - to accelerate our impact. We are also proud to include
                  several mangrove initiatives in our first cohort of Nature and
                  Sustainability{' '}
                  <a
                    href="https://www.salesforce.com/company/philanthropy/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    philanthropy
                  </a>{' '}
                  grantees.
                </p>
                <p>
                  These goals are bold, but they’re also within reach. Everyone
                  has a role to play in this global movement. Learn more about
                  the Mangrove Breakthrough and how you can join us below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
