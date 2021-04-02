import styles from './../styles/Social.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function Social() {
  return (
    <section className={styles.socialSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <img src="/tenants/salesforce/images/astro-social.png" alt="" />
            <h3>Invite a friend to join the trillion tree movement.</h3>
            <button>Share Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
