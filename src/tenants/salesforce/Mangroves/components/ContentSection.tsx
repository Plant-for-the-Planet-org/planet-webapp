import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import Link from 'next/link';
import MangroveMapIcon from '../../../../../public/assets/images/icons/MangroveMapIcon';
import ViewIcon from '../../../../../public/assets/images/icons/ViewIcon';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

export default function ContentSection() {
  const { localizedPath } = useLocalizedPath();
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd8} ${gridStyles.col12} ${gridStyles.textCenter}`}
          >
            <h2>Mangroves</h2>
            <h3 className={styles.contentSectionSubhead}>
              The ultimate champions for climate, nature and people.
            </h3>
            <p className={styles.contentSectionBlurb}>
              While mangrove forests cover less than 1% of land, they store up
              to 10 times more carbon per hectare than terrestrial forests. They
              support biodiversity by providing critical habitat for terrestrial
              and marine species while serving as a nursery for juvenile fish.
              And they function as a coastal barrier for climate vulnerable
              communities. In short - mangroves are one of nature’s
              “superheroes”.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.mbIntro}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12} ${styles.introCTA}`}
          >
            <div className={`${gridStyles.circularContainer}`}>
              <img
                src="/tenants/salesforce/images/mangroves/mangroves-indonesia.jpg"
                alt=""
              />
            </div>
            <Link href={localizedPath('/?filter=mangroves')}>
              <button className={styles.projectMapButton}>
                <MangroveMapIcon /> View Project Map
              </button>
            </Link>
            <Link href={'#project-grid'}>
              <button className={styles.projectListButton}>
                <ViewIcon /> View Project List
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
                <a
                  href="https://www.1t.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  1t.org
                </a>{' '}
                and delivers on our{' '}
                <a
                  href="https://www.salesforce.com/content/dam/web/en_us/www/assets/pdf/reports/salesforce-climate-action-plan.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  climate
                </a>{' '}
                and{' '}
                <a
                  href="https://www.salesforce.com/content/dam/web/en_us/www/documents/white-papers/nature-positive-strategy.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
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
                rel="noreferrer noopener"
              >
                Mangrove Breakthrough Secretariat{' '}
              </a>{' '}
              and the development of the recently launched{' '}
              <a
                href="https://climatechampions.unfccc.int/wp-content/uploads/2023/11/SY031_MangroveBreakthrough_2023_v7_JG.pdf"
                target="_blank"
                rel="noreferrer noopener"
              >
                Financial Roadmap
              </a>
              .
            </p>
            <p>
              In partnership with{' '}
              <a
                href="https://www.plant-for-the-planet.org/?gad_source=1&gclid=CjwKCAjw8diwBhAbEiwA7i_sJWbkVU_BglqiNDU1QLKdNko2AdseFgtGEu65nINJ2o8UwHR5DcLAVhoCNkIQAvD_BwE"
                target="_blank"
                rel="noreferrer noopener"
              >
                Plant-for-the-Planet
              </a>
              , we invested in eight mangrove restoration and conservation
              projects to support the Mangrove Breakthrough, including{' '}
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
                {/* cspell:ignore Fundación Mexicana Océano */}
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
                href="https://www.conservation.org/priorities/surf-conservation"
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
              </a>
              .
            </p>
            <p>
              In 2022, Salesforce included several mangrove projects in the{' '}
              <a
                href="https://www.salesforce.com/news/stories/salesforce-gives-11m-to-restore-ecosystems-and-advance-climate-justice/"
                target="_blank"
                rel="noreferrer noopener"
              >
                first cohort of grantees
              </a>{' '}
              receiving funds from Salesforce’s Ecosystem Restoration and
              Climate Justice Fund.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <p className={`${styles.contentSectionQuote} ${styles.bold}`}>
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
                  we can unlock the{' '}
                  <a
                    href="https://climatechampions.unfccc.int/wp-content/uploads/2023/11/SY031_MangroveBreakthrough_2023_v7_JG.pdf"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    $4 billion investment
                  </a>{' '}
                  needed to secure the future of this{' '}
                  <a
                    href="https://www.weforum.org/agenda/2023/11/mangrove-breakthrough-climate-targets-cop28/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    crucial global ecosystem
                  </a>{' '}
                  by 2030. As of April, 2024, over 50 governments, corporations,
                  non profits and civil society representatives have{' '}
                  <a
                    href="https://www.wetlands.org/a-breakthrough-moment-for-mangroves-delivering-global-action-on-mangrove-restoration-and-protection/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    endorsed
                  </a>{' '}
                  the Mangrove Breakthrough. Everyone has a role to play in this
                  collaborative quest.{' '}
                  <a
                    href="https://www.mangrovealliance.org/news/the-mangrove-breakthrough/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Learn more about the Mangrove Breakthrough and how you can
                    get involved here.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
