import { User } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import styles from './PublicProfileLayout.module.scss';
import ProfileCard from '../ProfileCard';

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const PublicProfileLayout = () => {
  const router = useRouter();
  const { user, contextLoaded } = useUserProps();
  const [profile, setProfile] = useState<null | User>();
  const screenWidth = window.innerWidth;
  // const isMobile = screenWidth <= 767;

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
      }
    }
  }, [contextLoaded, user, router]);

  return (
    <article className={styles.publicProfileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        <ProfileCard userProfile={profile} authenticatedType="public" />
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
