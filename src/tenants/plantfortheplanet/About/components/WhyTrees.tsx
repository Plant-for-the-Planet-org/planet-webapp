import LandingSection from './../../../../features/common/Layout/LandingSection';
import styles from './../About.module.scss';

export default function WhyTrees() {
  return (
    <LandingSection
      imageSrc={'/tenants/plantfortheplanet/images/home/WhyTrees.jpg'}
    >
      <div className={styles.YucantanSectionText}>
        <p className={styles.YucantanSectionTextHeader}>Why Trees?</p>
        <p className={styles.YucantanSectionTextPara}>
          How many are there? How many can we plant? Trees are one of the most
          powerful tools in a fight against the climate crisis.
        </p>
        <div className={styles.YucantanSectionTextLinkContainer}>
          <p className={styles.YucantanSectionTextLink}>Learn More</p>
        </div>
      </div>
    </LandingSection>
  );
}
