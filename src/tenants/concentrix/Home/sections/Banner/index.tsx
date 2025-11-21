import TreeCounter from './TreeCounter';
import WebappButton from '../../../../../features/common/WebappButton';
import styles from './Banner.module.scss';
import commonStyles from '../../common.module.scss';

const Banner = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.bannerVideoContainer}>
        <iframe
          src="https://customer-3h4q1m4a9rqr5i6y.cloudflarestream.com/352fc80fc79d7704e07962555fcb2041/iframe?muted=true&preload=true&loop=true&autoplay=true&controls=false&poster=https%3A%2F%2Fcustomer-3h4q1m4a9rqr5i6y.cloudflarestream.com%2F352fc80fc79d7704e07962555fcb2041%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D0s%26height%3D600"
          className={styles.iframe}
          allow={
            'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
          }
          allowFullScreen={true}
        ></iframe>
      </div>
      <div className={styles.bannerContent}>
        <TreeCounter />
        <WebappButton
          elementType="link"
          href="/"
          variant="primary"
          text="Help us get there"
          buttonClasses={`${commonStyles.buttonStyles}`}
        />
      </div>
    </section>
  );
};
export default Banner;
