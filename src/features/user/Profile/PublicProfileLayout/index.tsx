import type { UserPublicProfile } from '@planet-sdk/common';

import styles from './PublicProfileLayout.module.scss';
import ProfileCard from '../ProfileCard';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ForestProgress from '../ForestProgress';
import ContributionsMap from '../ContributionsMap';
import CommunityContributions from '../CommunityContributions';
import { useEffect, useMemo } from 'react';
import { useMyForestStore } from '../../../../stores/myForestStore';
import MyContributions from '../MyContributions';
import { aggregateProgressData } from '../../../../utils/myForestUtils';
import InfoAndCta from '../InfoAndCTA';
import TpoProjects from '../TpoProjects';
import { useApi } from '../../../../hooks/useApi';

interface Props {
  profile: UserPublicProfile | null;
  isProfileLoaded: boolean;
}

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const PublicProfileLayout = ({ profile, isProfileLoaded }: Props) => {
  const { getApi, getApiAuthenticated } = useApi();
  //States
  const isMyForestLoading = useMyForestStore(
    (state) => state.isMyForestLoading
  );
  const userInfo = useMyForestStore((state) => state.userInfo);
  const contributionStats = useMyForestStore(
    (state) => state.contributionsResult?.stats
  );

  //Actions
  const setUserInfo = useMyForestStore((state) => state.setUserInfo);
  const setIsPublicProfile = useMyForestStore(
    (state) => state.setIsPublicProfile
  );
  const fetchMyForest = useMyForestStore((state) => state.fetchMyForest);

  useEffect(() => {
    if (profile) {
      setIsPublicProfile(true);
      const _userInfo = {
        profileId: profile.id,
        slug: profile.slug,
        targets: {
          treesDonated: profile.scores.treesDonated.target ?? 0,
          areaRestored: profile.scores.areaRestored.target ?? 0,
          areaConserved: profile.scores.areaConserved.target ?? 0,
        },
      };

      setUserInfo(_userInfo);
    }
  }, [profile]);

  useEffect(() => {
    if (userInfo) fetchMyForest(getApi, getApiAuthenticated);
  }, [userInfo, fetchMyForest]);

  const { treesDonated, areaRestored, areaConserved } =
    aggregateProgressData(contributionStats);
  const treeTarget = userInfo?.targets.treesDonated ?? 0;
  const restorationTarget = userInfo?.targets.areaRestored ?? 0;
  const conservationTarget = userInfo?.targets.areaConserved ?? 0;

  const canShowLeaderboard = profile?.exposeCommunity ?? false;

  const isProgressBarDisabled = useMemo(() => {
    return (
      treesDonated === 0 &&
      areaRestored === 0 &&
      areaConserved === 0 &&
      treeTarget === 0 &&
      restorationTarget === 0 &&
      conservationTarget === 0
    );
  }, [
    treesDonated,
    areaRestored,
    areaConserved,
    treeTarget,
    restorationTarget,
    conservationTarget,
  ]);

  const isContributionsDataLoaded = !isMyForestLoading;
  const isLeaderboardLoaded = !isMyForestLoading;
  const isProgressDataLoaded = !isMyForestLoading && isProfileLoaded;
  const isTpoProfile = isProfileLoaded && profile?.type === 'tpo';

  return (
    <article
      className={`${styles.publicProfileLayout} ${
        !canShowLeaderboard && !isTpoProfile ? styles.noLeaderboard : ''
      } ${isProgressBarDisabled && !isTpoProfile ? styles.noProgress : ''} ${
        isTpoProfile ? styles.tpoProfile : ''
      }`}
    >
      <section id="profile-container" className={styles.profileContainer}>
        {isProfileLoaded && profile ? (
          <ProfileCard userProfile={profile} profilePageType="public" />
        ) : (
          <ProfileLoader height={450} />
        )}
      </section>
      {/* Render the following sections only when we know the profile belongs to a non-tpo user */}
      {!isTpoProfile && (
        <>
          <section
            id="map-container"
            className={`${styles.mapContainer} ${
              !isContributionsDataLoaded ? styles.loading : ''
            }`}
          >
            {isContributionsDataLoaded ? (
              <ContributionsMap
                profilePageType="public"
                supportedTreecounter={userInfo?.slug ?? ''}
              />
            ) : (
              <ProfileLoader height={450} />
            )}
          </section>
          {!isProgressBarDisabled && (
            <section
              id="progress-container"
              className={`${styles.progressContainer} ${
                !isProgressDataLoaded ? styles.loading : ''
              }`}
            >
              {isProgressDataLoaded ? (
                <ForestProgress profilePageType="public" />
              ) : (
                <ProfileLoader height={116} />
              )}
            </section>
          )}
          <section
            id="my-contributions-container"
            className={`${styles.myContributionsContainer} ${
              !isContributionsDataLoaded ? styles.loading : ''
            }`}
          >
            {isContributionsDataLoaded && profile ? (
              <MyContributions profilePageType="public" userProfile={profile} />
            ) : (
              <ProfileLoader height={350} />
            )}
          </section>
          {canShowLeaderboard && (
            <section
              id="community-contributions-container"
              className={`${styles.communityContributionsContainer} ${
                !isLeaderboardLoaded ? styles.loading : ''
              }`}
            >
              {isLeaderboardLoaded && profile ? (
                <CommunityContributions
                  userProfile={profile}
                  profilePageType="public"
                />
              ) : (
                <ProfileLoader height={350} />
              )}
            </section>
          )}
        </>
      )}
      {isTpoProfile && (
        <section
          id="tpo-projects-container"
          className={styles.tpoProjectsContainer}
        >
          <TpoProjects profile={profile} />
        </section>
      )}

      <section id="info-cta-container" className={styles.infoAndCtaContainer}>
        <InfoAndCta />
      </section>
    </article>
  );
};

export default PublicProfileLayout;
