// cspell:ignore costa-rica

import Link from 'next/link';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/SeaOfTrees.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

export default function SeaOfTrees() {
  const { localizedPath } = useLocalizedPath();
  return (
    <div>
      <div className={`${styles.seaOfTreesContainer}`}>
        <div className={`${gridStyles.fluidContainer} ${styles.seaOfTrees}`}>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
          >
            <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
              <h3>Mangrove Forests</h3>
              <p className={styles.contentSectionSubhead}>
                Where Ocean Sustainability meets Trees.
              </p>
              <p>
                Mangroves are the world’s “super trees”. Mangrove forests can
                sequester up to 10x as much carbon as trees on land; they
                provide habitat for hundreds of threatened species; they foster
                food security and livelihoods for communities that depend on the
                fish they shelter; and they serve as a buffer from storm surge,
                which makes them a powerful tool for coastal resilience. And in
                addition to all that, because vulnerable and Indigenous
                communities often live side-by-side with mangroves, they can
                also be a key solution for achieving climate justice.
              </p>
              <p>
                As part of our commitment to{' '}
                <a
                  href="https://www.1t.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  1t.org
                </a>
                , Salesforce is supporting the{' '}
                <a
                  href="https://www.mangrovealliance.org/news/the-mangrove-breakthrough/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Mangrove Breakthrough
                </a>
                , a collective initiative to secure the future of mangrove
                forests globally. Learn more about Salesforce’s mangrove journey
                and discover opportunities to join the movement here.
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
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.seaOfTreesImagesContainer}`}
          >
            <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
              <img
                src="/tenants/salesforce/images/madagascar.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
            <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
              <img
                src="/tenants/salesforce/images/costa-rica.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
            <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
              <img
                src="/tenants/salesforce/images/kenya.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
          </div>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
          >
            <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
              <hr />
            </div>
          </div>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
          >
            <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
              <h3>How can you help?</h3>
              <p>
                Just <Link href={localizedPath('/')}>click here</Link> to see
                what tree project you’d like to support today. Then look for
                your donation on the Donation Tracker below and spread the word
                to your family, friends, colleagues, and network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
