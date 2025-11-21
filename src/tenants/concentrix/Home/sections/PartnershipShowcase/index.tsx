import styles from './PartnershipShowcase.module.scss';
import commonStyles from '../../common.module.scss';
import WebappButton from '../../../../../features/common/WebappButton';
import VideoPlayer from '../../../../../features/projectsV2/ProjectDetails/components/VideoPlayer';
import { useState } from 'react';

const PartnershipShowcase = () => {
  const [hasVideoConsent, setHasVideoConsent] = useState(false);

  return (
    <section className={styles.partnershipShowcase}>
      <div className={styles.contentWrapper}>
        <h2 className={commonStyles.heading2}>Our Valued Partnerships</h2>
        <p className={styles.content}>
          The Plant-for-the-Planet partnership allows us to support impactful
          projects throughout our regions. Through their platform we are able to
          follow our commitments on enhancing ecosystems by planting and
          restoring trees, engaging in forest conservation, and supporting
          biodiversity initiatives worldwide.{' '}
        </p>
        <div className={styles.videoContainer}>
          <VideoPlayer
            videoUrl="https://www.youtube.com/embed/YG1558vDIns?si=olhZJJbE0DfcUzOc"
            hasConsent={hasVideoConsent}
            onConsentChange={setHasVideoConsent}
          />
        </div>

        <p className={styles.content}>
          We also recognise the significance of the social mechanisms that
          biodiversity protection relies upon including Education, Youth
          Empowerment, Training and Technology as well as those which it
          supports such as water supply, livelihood insurance and sustainable
          food sources. With this in mind, our partnership with
          Plant-for-the-Planet is giving us the opportunity to not only support
          the planting of trees but also help to drive the social mechanisms
          that effective and ever evolving best practice rely upon.
        </p>
        {/* Image section */}
        <WebappButton
          elementType="link"
          href="/en"
          variant="primary"
          text="Donate"
          buttonClasses={`${commonStyles.buttonStyles}`}
        />
        <h3 className={commonStyles.heading3}>Where does your donation go?</h3>
        {/* 75% - 25% image section */}
        <WebappButton
          elementType="link"
          href="https://www.plant-for-the-planet.org"
          target="_blank"
          variant="primary"
          text="Learn more"
          buttonClasses={`${commonStyles.buttonStyles}`}
        />
      </div>
    </section>
  );
};
export default PartnershipShowcase;
