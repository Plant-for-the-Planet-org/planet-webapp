import type { User } from '@planet-sdk/common';

import { useContext, useState } from 'react';
import ContributionsMap from '../ContributionsMap';
import styles from './ProfileLayout.module.scss';
import { useEffect } from 'react';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import ProfileCard from '../ProfileCard';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ForestProgress from '../ForestProgress';
import CommunityContributions from '../CommunityContributions';
import { useMyForestStore } from '../../../../stores/myForestStore';
import MyContributions from '../MyContributions';
import { useApi } from '../../../../hooks/useApi';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.

const ProfileLayout = () => {
  const { user, contextLoaded } = useUserProps();
  const { getApi, getApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [profile, setProfile] = useState<null | User>(null);

  const isMyForestLoading = useMyForestStore(
    (state) => state.isMyForestLoading
  );
  const userSlug = useMyForestStore((state) => state.userInfo?.slug);
  const errorMessage = useMyForestStore((state) => state.errorMessage);
  // Actions
  const setUserInfo = useMyForestStore((state) => state.setUserInfo);
  const fetchMyForest = useMyForestStore((state) => state.fetchMyForest);

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
        const _userInfo = {
          profileId: user.id,
          slug: user.slug,
          targets: {
            treesDonated: user.scores.treesDonated.target ?? 0,
            areaRestored: user.scores.areaRestored.target ?? 0,
            areaConserved: user.scores.areaConserved.target ?? 0,
          },
        };
        setUserInfo(_userInfo);
      }
    }
  }, [contextLoaded, user]);

  useEffect(() => {
    if (userSlug) fetchMyForest(getApi, getApiAuthenticated);
  }, [userSlug, fetchMyForest]);

  //TODO: Remove once error handling is fully migrated from useContext to Zustand
  useEffect(() => {
    if (errorMessage) setErrors([{ message: errorMessage }]);
  }, [errorMessage]);

  const isProfileLoaded = profile !== null && profile !== undefined;
  const isContributionsDataLoaded = !isMyForestLoading;
  const isLeaderboardLoaded = !isMyForestLoading;
  const isProgressDataLoaded = !isMyForestLoading && isProfileLoaded;

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
          <ContributionsMap profilePageType="private" />
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
