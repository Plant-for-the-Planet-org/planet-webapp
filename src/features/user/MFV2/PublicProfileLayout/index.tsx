import styles from './PublicProfileLayout.module.scss';
import ProfileCard from '../ProfileCard';
import { UserPublicProfile } from '@planet-sdk/common';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ForestProgress from '../ForestProgress';
import ContributionsMap from '../ContributionsMap';
import CommunityContributions from '../CommunityContributions';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import { handleError, APIError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import MyContributions from '../MyContributions';
import { aggregateProgressData } from '../../../../utils/myForestV2Utils';
import InfoAndCta from '../InfoAndCTA';

interface Props {
  tenantConfigId: string;
}

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const PublicProfileLayout = ({ tenantConfigId }: Props) => {
  const showLeaderboard = false;
  const [profile, setProfile] = useState<null | UserPublicProfile>();
  const { user, contextLoaded } = useUserProps();
  const router = useRouter();
  const {
    userInfo,
    setUserInfo,
    contributionStats,
    isContributionsLoaded,
    isProjectsListLoaded,
    isLeaderboardLoaded,
  } = useMyForestV2();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);

  async function loadPublicProfile(id: string) {
    try {
      const profileData = await getRequest<UserPublicProfile>(
        tenantConfigId,
        `/app/profiles/${id}`
      );
      setProfile(profileData);
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/');
    }
  }

  useEffect(() => {
    if (profile) {
      const _userInfo = {
        profileId: profile.id,
        slug: profile.slug,
        targets: {
          treesDonated: profile.targets.treesDonated ?? 0,
          areaRestored: profile.targets.areaRestored ?? 0,
          areaConserved: profile.targets.areaConserved ?? 0,
        },
      };

      setUserInfo(_userInfo);
    }
  }, [profile]);

  useEffect(() => {
    if (router && router.isReady && router.query.profile && contextLoaded) {
      // reintiating the profile
      setProfile(null);
      loadPublicProfile(router.query.profile as string);
    }
  }, [contextLoaded, user, router]);
  const { treesDonated, areaRestored, areaConserved } =
    aggregateProgressData(contributionStats);
  const treeTarget = userInfo?.targets.treesDonated ?? 0;
  const restoreTarget = userInfo?.targets.areaRestored ?? 0;
  const conservTarget = userInfo?.targets.areaConserved ?? 0;

  const isProgressBarDisabled = useMemo(() => {
    return (
      treesDonated === 0 &&
      areaRestored === 0 &&
      areaConserved === 0 &&
      treeTarget === 0 &&
      restoreTarget === 0 &&
      conservTarget === 0
    );
  }, [
    treesDonated,
    areaRestored,
    areaConserved,
    treeTarget,
    restoreTarget,
    conservTarget,
  ]);

  const isProfileLoaded = profile !== null && profile !== undefined;
  const isContributionsDataLoaded =
    isContributionsLoaded && isProjectsListLoaded;
  const isProgressDataLoaded =
    isContributionsLoaded && profile !== null && profile !== undefined;

  return (
    <article
      className={`${styles.publicProfileLayout} ${
        !showLeaderboard ? styles.noLeaderboard : ''
      } ${isProgressBarDisabled ? styles.noProgress : ''}`}
    >
      <section id="profile-container" className={styles.profileContainer}>
        {isProfileLoaded ? (
          <ProfileCard userProfile={profile} profilePageType="public" />
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
          <ContributionsMap
            profilePageType="public"
            supportedTreecounter={userInfo?.slug ?? ''}
          />
        ) : (
          <ProfileLoader height={450} />
        )}
      </section>
      {isProgressBarDisabled ? (
        <></>
      ) : (
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
      {showLeaderboard ? (
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
              profilePageType="public"
            />
          ) : (
            <ProfileLoader height={350} />
          )}
        </section>
      ) : null}
      <section id="info-cta-container" className={styles.infoAndCtaContainer}>
        <InfoAndCta />
      </section>
    </article>
  );
};

export default PublicProfileLayout;
