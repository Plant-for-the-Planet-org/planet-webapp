import ContributionsMap from '../ContributionsMap';
import styles from './ProfileLayout.module.scss';
import { User } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import ProfileCard from '../ProfileCard';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const ProfileLayout = () => {
  const router = useRouter();
  const { user, contextLoaded } = useUserProps();
  const [profile, setProfile] = React.useState<null | User>(null);

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
      }
    }
  }, [contextLoaded, user, router]);

  return (
    <article className={styles.profileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        {profile ? (
          <ProfileCard userProfile={profile} profileType="private" />
        ) : (
          <ProfileLoader />
        )}
      </section>
      <section id="map-container" className={styles.mapContainer}>
        <ContributionsMap />
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
