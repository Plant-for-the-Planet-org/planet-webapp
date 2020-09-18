import Youtube from '../../../../assets/images/home/Youtube';
import LandingSection from './../../../../features/common/Layout/LandingSection';
import styles from './../About.module.scss';
export default function Landing() {
  return (
    <LandingSection>
      <div className={styles.landingContent}>
        <Youtube />
        <p>
          We children and youth to stand up for their future by planting trees &
          mobilizing the world to plant a trillion!
        </p>
      </div>
    </LandingSection>
  );
}
