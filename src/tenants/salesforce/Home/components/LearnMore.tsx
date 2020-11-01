import styles from './../styles/LearnMore.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function LearnMore() {
  return (
    <div className={`${gridStyles.gridRow} ${styles.learnMoreSectionRow}`}>
      <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${styles.learnMoreSection}`}></div>
      <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${styles.learnMoreSectionText}`}>
        <h2 className={styles.learnMoreSectionTextHeader}>It's bigger than trees.</h2>
        <p className={styles.learnMoreSectionTextPara}>
        We’re committed to doing everything we can to step up to the urgent challenge of climate change and creating a sustainable, low-carbon future for all. That means reducing emissions, as well as protecting and improving carbon sinks like forests. 
        <br />
          <br />
Forests, which are critical to the health of our planet, covered about half the earth before the agricultural revolution began. In the 8,000 years since, while we’ve managed to feed and house billions of people, we’ve also lost or degraded half of those forests, fueling a biodiversity collapse and the climate crisis. It’s time we stop taking from our natural ecosystems, and start giving back. 
         
          
        </p>
      </div>
    </div>
  );
}
