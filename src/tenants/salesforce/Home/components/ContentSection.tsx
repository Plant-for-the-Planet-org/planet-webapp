import gridStyles from './../styles/Grid.module.scss'
import styles from './../styles/ContentSection.module.scss';

export default function ContentSection() {
  return (
    <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
      <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
        <div className={`${gridStyles.colMd10} ${gridStyles.col12}`}>
          <h2>We’re taking a stand for trees.</h2>
          <p className={styles.contentSectionSubhead}>We’re committed to doing everything we can to tackle climate change and create a sustainable, low-carbon future for all. That means reducing emissions, as well as protecting and improving carbon sinks like forests — the lungs of the Earth. </p>
        </div>
      </div>
      <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
        <div className={`${gridStyles.colMd5} ${gridStyles.col12}`}>
          <img src="/tenants/salesforce/images/illustration-1.png" className={gridStyles.imgFluid} alt="" />
        </div>
        <div className={`${gridStyles.colMd7} ${gridStyles.col12}`}>
          <h3>We save trees, trees save us.</h3>
          <p>Trees offer cooling shade, block cold winter winds, improve biodiversity, purify our air, prevent soil erosion, clean our water, and add grace and beauty to our homes and communities. Fun fact: 80% of terrestrial species inhabit forests, with tropical forests alone hosting over half of the world’s biodiversity.</p>
          <p>Without forests, life as we know it would cease to exist — forests are intimately entwined with the world’s human and environmental systems. However, since the dawn of human civilization, nearly half the world’s forests have been cleared or degraded, largely to feed our growing population. We continue to lose 15 billion trees per year. Of the original 6 trillion, only 3 trillion remain.</p>
        </div>
      </div>
      <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
        <div className={`${gridStyles.colMd7} ${gridStyles.col12}`}>
          <h3>Business is a platform for change.</h3>
          <p>We have a responsibility to our stakeholders, including the planet, to use our full power to limit global warming to 1.5° Celsius or less. From what we make and how we make it, to how we use our influence, Salesforce thinks about how we can use our influence for the greatest good in the high-stakes climate emergency challenge.</p>
          <p>In January 2020, as a founding partner of 1t.org and in support of its mission, Salesforce announced our own goal to support and mobilize the conservation, restoration, and growth of 100 million trees by the end of 2030.</p>
          <p>We know we’ll have to refine our programs and methodology over time by sharing with and learning from others, but we know it must be done in a socially and ecologically responsible way. Being socially responsible means meaningfully engaging with indigenous people and local communities on this journey. Restoration of our ecosystems is only sustainable when local communities reap social, economic, and ecological benefits.</p>
        </div>
        <div className={`${gridStyles.colMd5} ${gridStyles.col12}`}>
          <img src="/tenants/salesforce/images/illustration-2.png" className={gridStyles.imgFluid} alt="" />
        </div>
      </div>
    </div>
  );
}
