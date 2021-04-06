import styles from './../styles/Social.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function Social() {
  return (
    <section className={styles.socialSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>Invite a friend to join the trillion tree movement.</h3>
            <div className={styles.socialContent}>
              <img src="/tenants/salesforce/images/astro-social.png" alt="" />
              <a href="" className={styles.socialFacebook}><img src="/tenants/salesforce/images/facebook.png" alt=""/></a>
              <a href="" className={styles.socialLinkedin}><img src="/tenants/salesforce/images/linkedin.png" alt=""/></a>
              <a href="" className={styles.socialTwitter}><img src="/tenants/salesforce/images/twitter.png" alt=""/></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
