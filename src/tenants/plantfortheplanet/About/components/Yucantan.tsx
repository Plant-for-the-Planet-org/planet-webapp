import LandingSection from './../../../../features/common/Layout/LandingSection';
import styles from './../About.module.scss';

export default function Yucantan() {
  return (
    <LandingSection
      imageSrc={'/tenants/plantfortheplanet/images/home/Yucantan.jpg'}
    >
      <div className={styles.YucantanSectionText}>
        <p className={styles.YucantanSectionTextHeader}>
          Yucatan Reforestation
        </p>
        <p className={styles.YucantanSectionTextPara}>
          100 people planting 2 million trees a year to bring back a beautiful
          rainforest
        </p>
        <div className={styles.YucantanSectionTextLinkContainer}>
          <p className={styles.YucantanSectionTextLink}>Learn More</p>
          <p className={styles.YucantanSectionTextLink}>Donate</p>
        </div>
      </div>
    </LandingSection>
  );
}
