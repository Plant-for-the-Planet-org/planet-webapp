import WebappButton from '../../../../../features/common/WebappButton';
import styles from './Sustainability.module.scss';
import commonStyles from '../../common.module.scss';

const Sustainability = () => {
  return (
    <section className={styles.sustainability}>
      <div className={styles.contentContainer}>
        <div className={styles.quote}>
          “Together we are working to accelerate toward a more sustainable
          planet by reducing our company’s impact and by protecting and
          restoring the planet”
        </div>
        <WebappButton
          elementType="link"
          href="https://www.concentrix.com/esg/"
          target="_blank"
          variant="primary"
          text="Concentrix ESG report"
          buttonClasses={`${commonStyles.buttonStyles}`}
        />
        <div className={styles.sdgCardList}>
          <div className={styles.sdgCardItem}>
            <img
              src="/assets/images/sdgCards/Goal-04.png"
              alt="SDG 4 - Quality Education"
            />
          </div>
          <div className={styles.sdgCardItem}>
            <img
              src="/assets/images/sdgCards/Goal-13.png"
              alt="SDG 13 - Climate Action"
            />
          </div>
          <div className={styles.sdgCardItem}>
            <img
              src="/assets/images/sdgCards/Goal-15.png"
              alt="SDG 15 - Life on Land"
            />
          </div>
          <div className={styles.sdgCardItem}>
            <img src="/assets/images/sdgCards/Goal-17.png" />
          </div>
        </div>
        <div className={styles.aboutSustainableActions}>
          Every action - big or small - counts when it comes to shaping the
          future of our planet. That’s why we’re committed to running our
          business as sustainably as possible, from transitioning to renewable
          energy wherever we can, embracing sustainable building practices and
          focusing on actions directed at both Climate and Nature.
        </div>
      </div>
    </section>
  );
};
export default Sustainability;

/* const sdgCardImageLinks = [
  {
    key: t('infoAndCtaContainer.sdgCardAlternativeText.qualityEducation'),
    link: '/assets/images/sdgCards/Goal-04.png',
  },
  {
    key: t('infoAndCtaContainer.sdgCardAlternativeText.climateAction'),
    link: '/assets/images/sdgCards/Goal-13.png',
  },
  {
    key: t('infoAndCtaContainer.sdgCardAlternativeText.lifeOnLand'),
    link: '/assets/images/sdgCards/Goal-15.png',
  },
  {
    key: t('infoAndCtaContainer.sdgCardAlternativeText.partnership'),
    link: '/assets/images/sdgCards/Goal-17.png',
  },
]; */
