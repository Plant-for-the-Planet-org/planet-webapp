import gridStyles from './../styles/Grid.module.scss'
import styles from './../styles/SeaOfTrees.module.scss';
import Link from 'next/link';

export default function SeaOfTrees() {
  return (
    <div className={`${styles.seaOfTreesContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.seaOfTrees}`}>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h3>Sea of Trees</h3>
            <p className={styles.contentSectionSubhead}>Where Ocean Sustainability meets Trees.</p>
            <p>Bold Ocean-Climate Action is necessary to create a just and sustainable future where everyone can thrive. We strive for Ocean Action for all, by all.<br /><br />The Salesforce Ocean Sustainability Program taps into the full power of Salesforce to protect, restore, and invest in mangroves, kelp, corals, salt marshes, sea grass, and oyster reefs.<br /><br />Improved protection, restoration, and management of blue carbon ecosystems will grow global carbon sequestration capacity, increase resilience, enhance food security, and secure livelihoods.</p>
            <a href="https://donate.plant-for-the-planet.org/?to=proj_7gmlF7Q8aL65V7j7AG9NW8Yy&tenant=ten_3hEjJCBs" target="_blank" rel="noopener noreferrer">
              <button>Donate to Seas of Trees Projects</button>
            </a>
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.seaOfTreesImagesContainer}`}>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
            <img src="/tenants/salesforce/images/madagascar.png" className={gridStyles.illustration1} alt="" />
          </div>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
            <img src="/tenants/salesforce/images/costa-rica.png" className={gridStyles.illustration1} alt="" />
          </div>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
            <img src="/tenants/salesforce/images/kenya.png" className={gridStyles.illustration1} alt="" />
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <hr />
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h3>How can you help?</h3>
            <p>Just <a href="/">click here</a> to see what tree project you’d like to support today. Then look for your donation on the Donation Tracker below and spread the word to your family, friends, colleagues, and network.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
