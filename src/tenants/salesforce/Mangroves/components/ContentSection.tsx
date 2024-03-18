import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import Link from 'next/link';
import MangroveMapIcon from '../../../../../public/assets/images/icons/MangroveMapIcon';

export default function ContentSection() {
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd8} ${gridStyles.col12} ${gridStyles.textCenter}`}
          >
            <h2>Mangroves.</h2>
            <h3>The ultimate champions for climate, nature and people.</h3>
            <p className={styles.contentSectionSubhead}>
              Mangrove ecosystems store up to 10X more carbon per hectare than
              terrestrial forests. They support biodiversity by providing
              critical habitat for terrestrial and marine species while serving
              as a nursery for juvenile fish. And they function as a coastal
              barrier for climate vulnerable communities. In short - mangroves
              are one of nature’s “superheroes”.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.mbIntro}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12} ${styles.introCTA}`}
          >
            <div
              className={`${gridStyles.circularContainer} ${styles.imageContainer}`}
            >
              <img
                src="/tenants/salesforce/images/mangroves/mangroves-indonesia.jpg"
                alt=""
              />
            </div>
            <Link href="/?filter=mangroves">
              <button className={styles.projectMapButton}>
                <MangroveMapIcon /> View Project Map
              </button>
            </Link>
          </div>
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
          >
            <h3>Salesforce supports the Mangrove Breakthrough</h3>
            <p>
              <em>
                This is part of our commitment to{' '}
                <a href="https://www.1t.org/" target="_blank" rel="noreferrer">
                  1t.org
                </a>{' '}
                and delivers on our{' '}
                <a
                  href="https://www.salesforce.com/content/dam/web/en_us/www/assets/pdf/reports/salesforce-climate-action-plan.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  climate
                </a>{' '}
                and{' '}
                <a
                  href="https://www.salesforce.com/content/dam/web/en_us/www/documents/white-papers/nature-positive-strategy.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  nature
                </a>{' '}
                strategies.
              </em>
            </p>
            <p>
              Salesforce supported the establishment of the{' '}
              <a
                href="https://www.salesforce.com/news/stories/climate-week-investments-climate-finance-playbook/"
                target="_blank"
                rel="noreferrer"
              >
                Mangrove Breakthrough Secretariat{' '}
              </a>{' '}
              and the development of the recently launched{' '}
              <a
                href="https://climatechampions.unfccc.int/wp-content/uploads/2023/11/SY031_MangroveBreakthrough_2023_v7_JG.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Financial Roadmap
              </a>
              .
            </p>
            <p>
              In 2023, Salesforce provided funding to conserve, restore, and
              grow over 8 M trees across 7 high quality mangrove projects [TODO
              - LINK to April philanthropy rollup].
            </p>
            <p>
              As of April 2024, Salesforce has invested in the conservation and
              restoration of mangroves across [16] countries and over [50,000]
              hectares.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.calloutContainer}`}
        >
          <div
            className={`${gridStyles.col12} ${gridStyles.colMd8} ${styles.justifyContentCenter} ${styles.mbCallout}`}
          >
            <div className={`${styles.calloutContentContainer}`}>
              <div className={styles.calloutContentOverlay}></div>
              <div className={styles.calloutContent}>
                <h3>The Mangrove Breakthrough</h3>
                <p>
                  The Mangrove Breakthrough is a collective initiative to secure
                  the future of the world’s entire mangrove ecosystem.{' '}
                </p>
                <ul>
                  The Breakthrough has four key science-based goals to:
                  <li>
                    <strong>Halt mangrove loss</strong>
                  </li>
                  <li>
                    <strong>Restore half of recent losses</strong>
                  </li>
                  <li>
                    <strong>Double the protection</strong> of mangroves globally
                  </li>
                  <li>
                    <strong>Mobilize long-term, sustainable finance</strong> for
                    mangroves
                  </li>
                </ul>
                <p>
                  These goals are bold, but they’re also within reach. Together,
                  we can unlock the $4 billion investment needed to secure the
                  future of this{' '}
                  <a
                    href="https://www.weforum.org/agenda/2023/11/mangrove-breakthrough-climate-targets-cop28/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    crucial global ecosystem
                  </a>{' '}
                  by 2030. As of April, 2024, over 50 governments, corporations,
                  non profits and civil society representatives have{' '}
                  <a
                    href="https://www.wetlands.org/a-breakthrough-moment-for-mangroves-delivering-global-action-on-mangrove-restoration-and-protection/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    endorsed
                  </a>{' '}
                  the Mangrove Breakthrough. Everyone has a role to play in this
                  collaborative quest. Learn more about the Mangrove
                  Breakthrough and how you can get involved here [Todo: LINK].
                </p>
              </div>
            </div>
            <div className={`${styles.calloutQuote}`}>
              <p>
                <em>
                  “Mangroves are unparalleled in their role as a powerful
                  climate solution, a bedrock of biodiversity, and a source of
                  livelihood for millions of people around the world”
                </em>{' '}
                - Suzanne DiBianca, EVP and Chief Impact Officer at Salesforce
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
