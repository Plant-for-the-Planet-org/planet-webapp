import styles from './Banner.module.scss';

const Banner = () => {
  return (
    <section className={styles.banner}>
      {/* video background */}
      <div className={styles.bannerVideoContainer}>
        <iframe
          src="https://customer-3h4q1m4a9rqr5i6y.cloudflarestream.com/352fc80fc79d7704e07962555fcb2041/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-3h4q1m4a9rqr5i6y.cloudflarestream.com%2F352fc80fc79d7704e07962555fcb2041%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false"
          className={styles.iframe}
          allow={
            'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
          }
          allowFullScreen={true}
        ></iframe>
      </div>
      {/* treecounter */}
        {/* Help us get there button */}
    </section>
  );
};
export default Banner;
