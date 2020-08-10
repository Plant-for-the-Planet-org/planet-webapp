import LandingSection from './../../../../features/common/Layout/LandingSection';
import styles from './../About.module.scss';

export default function ClimateNeutrality() {
  return (
    <LandingSection
      imageSrc={'/tenants/plantfortheplanet/images/home/ClimageNeutrality.jpg'}
    >
      <div className={styles.YucantanSectionText}>
        <p className={styles.YucantanSectionTextHeader}>
          Double Climate Neutrality
        </p>
        <p className={styles.YucantanSectionTextPara}>
          We work with you on your climate journey with Carbon Credits
        </p>
        <div className={styles.YucantanSectionTextLinkContainer}>
          <p className={styles.YucantanSectionTextLink}>Learn More</p>
        </div>
      </div>
    </LandingSection>
  );
}
