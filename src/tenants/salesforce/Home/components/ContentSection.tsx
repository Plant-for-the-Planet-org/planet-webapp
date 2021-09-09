import gridStyles from './../styles/Grid.module.scss'
import styles from './../styles/ContentSection.module.scss';

export default function ContentSection() {
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h2>This beautiful planet is the only home we have.</h2>
            <p className={styles.contentSectionSubhead}>From the Andes to the Outback, from mangroves to Giant redwood groves, life on Earth hangs in the balance. Salesforce is doing everything we can to counter climate change and create a sustainable, low-carbon future for all. That means reducing emissions, as well as protecting and improving carbon sinks like forests — the lungs of the Earth.</p>
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}>
            <img src="/tenants/salesforce/images/illustration-1.png" className={gridStyles.illustration1} alt="" />
          </div>
          <div className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}>
            <h3>We Save Trees, Trees Save Us.</h3>
            <p>Trees purify our air, cool our planet, prevent soil erosion, and add grace and beauty to our homes and communities. Without trees, life as we know it will cease to exist. However, since the dawn of civilization, nearly half the world’s forests have been cleared or degraded. And we continue to lose 10 billion trees per year. Of the original 6 trillion trees that once covered the earth’s landmass, only 3 trillion remain.</p>
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd7} ${gridStyles.col12} ${gridStyles.orderSm1} ${gridStyles.orderMd0} ${styles.justifyContentCenter}`}>
            <h3>Business is a platform for change.</h3>
            <p>We have a responsibility to our stakeholders, including the planet, to use our full power to limit global warming to 1.5° Celsius or less. From what we make and how we make it, Salesforce thinks about how we can use our influence for the greatest good to help solve this climate emergency challenge.<br /><br />In January 2020, as a founding partner of 1t.org, Salesforce announced our own goal to support and mobilize the conservation, restoration, and growth of 100 million trees by the end of 2030.<br /><br />We know we’ll have to refine our programs and methodology over time by sharing with and learning from others, but we know it must be done in a socially and ecologically responsible way.  This includes meaningfully engaging with indigenous people and local communities on this journey. Restoration of our ecosystems is only sustainable when local communities reap social, economic, and ecological benefits.</p>
          </div>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12} ${gridStyles.orderSm0} ${gridStyles.orderMd1}`}>
            <img src="/tenants/salesforce/images/illustration-2.png" className={gridStyles.illustration2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
