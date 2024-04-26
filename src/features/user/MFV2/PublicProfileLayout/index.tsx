import styles from './PublicProfileLayout.module.scss';

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const PublicProfileLayout = () => {
  return (
    <article className={styles.publicProfileLayout}>
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
      <section
        id="community-contributions-container"
        className={styles.communityContributionsContainer}
      >
        Community Contributions
      </section>
      <section id="info-cta-container" className={styles.infoAndCtaContainer}>
        Additional information and CTAs - Become a member, Treegame, SDG Slider
      </section>
    </article>
  );
};

export default PublicProfileLayout;
