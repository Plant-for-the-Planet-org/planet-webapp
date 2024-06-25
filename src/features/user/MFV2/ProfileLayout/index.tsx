import ContributionsMap from '../ContributionsMap';
import styles from './ProfileLayout.module.scss';
import { User } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import ProfileCard from '../ProfileCard';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ForestProgress from '../ForestProgress';
import CommunityContributions from '../CommunityContributions';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import MyContributions from '../MyContributions';

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.

const ProfileLayout = () => {
  const router = useRouter();
  const { user, contextLoaded } = useUserProps();
  const [profile, setProfile] = React.useState<null | User>(null);
  const { setUserInfo, contributionStats, userInfo } = useMyForestV2();

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
        const _userInfo = {
          profileId: user.id,
          slug: user.slug,
          targets: {
            treesDonated: user.targets.treesDonated ?? 0,
            areaRestored: user.targets.areaRestored ?? 0,
            areaConserved: user.targets.areaConserved ?? 0,
          },
        };
        setUserInfo(_userInfo);
      }
    }
  }, [contextLoaded, profile, router]);

  return (
    <article className={styles.profileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        {profile ? (
          <ProfileCard userProfile={profile} profilePageType="private" />
        ) : (
          <ProfileLoader height={350} />
        )}
      </section>
      <section id="map-container" className={styles.mapContainer}>
        {contributionStats ? (
          <ContributionsMap />
        ) : (
          <ProfileLoader height={350} />
        )}
      </section>
      <section id="progress-container" className={styles.progressContainer}>
        {contributionStats && userInfo ? (
          <ForestProgress profilePageType="private" />
        ) : (
          <ProfileLoader height={116} />
        )}
      </section>
      <section
        id="my-contributions-container"
        className={styles.myContributionsContainer}
      >
        {profile ? (
          <MyContributions profilePageType="private" userProfile={profile} />
        ) : null}
      </section>
      <section
        id="community-contributions-container"
        className={styles.communityContributionsContainer}
      >
        {profile ? (
          <CommunityContributions
            userProfile={profile}
            profilePageType="private"
          />
        ) : (
          <ProfileLoader height={350} />
        )}
      </section>
    </article>
  );
};

export default ProfileLayout;
