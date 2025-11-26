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
        <h2 className={commonStyles.heading2}>
          Partnership with Plant-for-the-Planet
        </h2>
        <p className={styles.content}>
          The Plant-for-the-Planet partnership allows us to support impactful
          projects throughout our regions. Through their platform we are able to
          follow our commitments on enhancing ecosystems by planting and
          restoring trees, engaging in forest conservation, and supporting
          biodiversity initiatives worldwide.{' '}
        </p>
        <div className={styles.videoContainer}>
          <VideoPlayer
            videoUrl="https://www.youtube.com/embed/qpf73RBlLFg"
            hasConsent={hasVideoConsent}
            onConsentChange={setHasVideoConsent}
            backgroundImage="/tenants/concentrix/images/video-player-background.png"
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
        <div className={styles.imageBentoGrid}>
          <div className={`${styles.bentoImage} ${styles.bentoImageLeft}`}>
            <img
              src="/tenants/concentrix/images/20200128_ac_flaviai_156.jpg"
              alt="Children planting trees"
            />
          </div>
          <div className={`${styles.bentoImage} ${styles.bentoImageCenter}`}>
            <img
              src="/tenants/concentrix/images/20170513_de_Gersthofen_pflanzaktion_01.jpg"
              alt="Girls planting a tree"
            />
          </div>
          <div className={`${styles.bentoImage} ${styles.bentoImageRight}`}>
            <img
              src="/tenants/concentrix/images/54882972563_b6d580f721_o.jpg"
              alt="Children learning about trees"
            />
          </div>
        </div>
        <WebappButton
          elementType="link"
          href="/en"
          variant="primary"
          text="Donate"
          buttonClasses={`${commonStyles.buttonStyles}`}
        />
        <h3 className={commonStyles.heading3}>Where does your donation go?</h3>
        <div className={styles.donationBreakdown}>
          <div className={styles.mainProjectInfo}>
            <div className={styles.percentage}>75%</div>
            <div className={styles.explanation}>
              go directly to to planting project you choose on the world map for
              the planting of your trees.
            </div>
          </div>
          <div className={styles.supportProjectInfo}>
            <div className={styles.percentage}>25%</div>
            <div className={styles.explanation}>
              go into research, IT development and education.
            </div>
          </div>
        </div>
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
