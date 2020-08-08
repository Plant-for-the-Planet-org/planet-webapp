import Image from 'react-bootstrap/Image';
import LazyLoad from 'react-lazyload';
import Youtube from '../../../../assets/images/home/Youtube';
import styles from './../About.module.scss';
export default function Landing() {
  return (
    <section className={styles.landingSection}>
      <div className={styles.backgroundImage}>
        <LazyLoad>
          <Image fluid src={'/static/images/home/BGHome.jpg'} />
        </LazyLoad>
      </div>

      <div className={styles.landingContent}>
        <Youtube />
        <p>
          We children and youth to stand up for their future by planting trees &
          mobilizing the world to plant a trillion!
        </p>
      </div>
    </section>
  );
}
