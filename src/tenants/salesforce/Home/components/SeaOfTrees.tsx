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
            <p>Bold Ocean-Climate Action is necessary to create a just and sustainable future where everyone can thrive.<br />We strive for Ocean action for all, by all.<br /><br />The Salesforce &quot;Seas of Trees&quot; Program taps into the full power of Salesforce to protect, restore, and invest in mangroves, kelp, corals, salt marshes, sea grass, and oyster reefs.</p>
            <Link href="/">
              <button>Help us get there</button>
            </Link>
          </div>
        </div>
        {/* <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
            <img src="/tenants/salesforce/images/illustration-1.png" className={gridStyles.illustration1} alt="" />
          </div>
          <div className={`${gridStyles.colMd7} ${gridStyles.col12} ${styles.justifyContentCenter}`}>
            <h3>Together, we are powerful.</h3>
            <p>In January 2020, as a founding partner of 1t.org, Salesforce announced our goal to conserve, restore, and grow 100 million trees by the end of 2030. We have a responsibility to use our full power to limit global warming to 1.5° Celsius or less. We’re simply asking you to participate and rally your allies to create a world that is just and equitable, so everyone can have equal access to clean air, water, and energy.</p>
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd7} ${gridStyles.col12} ${gridStyles.orderSm1} ${gridStyles.orderMd0} ${styles.justifyContentCenter}`}>
            <h3>How can you help?</h3>
            <p>Please visit Plant for the Planet and see what trees you’d like to plant. Then look for your donation on the Donation Tracker below, and spread the word to your family, friends, colleagues, and network. There’s far to go, but we can do it together.</p>
          </div>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12} ${gridStyles.orderSm0} ${gridStyles.orderMd1}`}>
            <img src="/tenants/salesforce/images/illustration-2.png" className={gridStyles.illustration2} alt="" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
