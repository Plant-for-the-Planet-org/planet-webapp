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
  const {
    setUserInfo,
    isContributionsLoaded,
    isProjectsListLoaded,
    isLeaderboardLoaded,
  } = useMyForestV2();

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

  const isProfileLoaded = profile !== null && profile !== undefined;
  const isContributionsDataLoaded =
    isContributionsLoaded && isProjectsListLoaded;
  const isProgressDataLoaded =
    isContributionsLoaded && profile !== null && profile !== undefined;

  return (
    <article className={styles.profileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        {isProfileLoaded ? (
          <ProfileCard userProfile={profile} profilePageType="private" />
        ) : (
          <ProfileLoader height={450} />
        )}
      </section>
      <section
        id="map-container"
        className={`${styles.mapContainer} ${
          !isContributionsDataLoaded ? styles.loading : ''
        }`}
      >
        {isContributionsDataLoaded ? (
          <ContributionsMap />
        ) : (
          <ProfileLoader height={450} />
        )}
      </section>
      <section
        id="progress-container"
        className={`${styles.progressContainer} ${
          !isProgressDataLoaded ? styles.loading : ''
        }`}
      >
        {isProgressDataLoaded ? (
          <ForestProgress profilePageType="private" />
        ) : (
          <ProfileLoader height={116} />
        )}
      </section>
      <section
        id="my-contributions-container"
        className={`${styles.myContributionsContainer} ${
          !isContributionsDataLoaded ? styles.loading : ''
        }`}
      >
        {isContributionsDataLoaded && profile ? (
          <MyContributions profilePageType="private" userProfile={profile} />
        ) : (
          <ProfileLoader height={350} />
        )}
      </section>
      <section
        id="community-contributions-container"
        className={`
					${styles.communityContributionsContainer} ${
          !isLeaderboardLoaded ? styles.loading : ''
        }`}
      >
        {isLeaderboardLoaded && profile ? (
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
