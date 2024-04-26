import styles from './ProfileLayout.module.scss';

const ProfileLayout = () => {
  return (
    <article className={styles.profileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        Profile
      </section>
      <section id="map-container" className={styles.mapContainer}>
        Map
      </section>
      <section id="progress-container" className={styles.progressContainer}>
        Progress
      </section>
      <section
        id="my-contributions-container"
        className={styles.myContributionsContainer}
      >
        My Contributions
      </section>
      <section
        id="community-contributions-container"
        className={styles.communityContributionsContainer}
      >
        Community Contributions
      </section>
    </article>
  );
};

export default ProfileLayout;
