import { useContext } from 'react';
import ContributionsMap from '../ContributionsMap';
import styles from './ProfileLayout.module.scss';
import { useEffect } from 'react';
import ProfileCard from '../ProfileCard';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ForestProgress from '../ForestProgress';
import CommunityContributions from '../CommunityContributions';
import {
  useAuthStore,
  useMyForestStore,
  useUserStore,
} from '../../../../stores';
import MyContributions from '../MyContributions';
import { useApi } from '../../../../hooks/useApi';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { clsx } from 'clsx';
import { transformProfileToForestUserInfo } from '../../../../utils/myForestUtils';

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.

const ProfileLayout = () => {
  const { getApi, getApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);

  const isMyForestLoading = useMyForestStore(
    (state) => state.isMyForestLoading
  );
  const userSlug = useMyForestStore((state) => state.userInfo?.slug);
  const errorMessage = useMyForestStore((state) => state.errorMessage);
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  // Actions
  const setUserInfo = useMyForestStore((state) => state.setUserInfo);
  const fetchMyForest = useMyForestStore((state) => state.fetchMyForest);
  const setIsPublicProfile = useMyForestStore(
    (state) => state.setIsPublicProfile
  );
  const resetMyForestStore = useMyForestStore(
    (state) => state.resetMyForestStore
  );

  useEffect(() => {
    if (!isAuthResolved || !userProfile) return;

    setIsPublicProfile(false);
    setUserInfo(transformProfileToForestUserInfo(userProfile));
  }, [isAuthResolved, userProfile]);

  useEffect(() => {
    if (userSlug) fetchMyForest(getApi, getApiAuthenticated);
  }, [userSlug, fetchMyForest]);

  // myForest data is always fetched fresh;
  // clear the store on unmount since persisting it provides no caching benefit
  useEffect(() => {
    return () => {
      resetMyForestStore();
    };
  }, []);

  //TODO: Remove once error handling is fully migrated from useContext to Zustand
  useEffect(() => {
    setErrors(errorMessage ? [{ message: errorMessage }] : null);
  }, [errorMessage]);

  return (
    <article className={styles.profileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        {userProfile ? (
          <ProfileCard userProfile={userProfile} profilePageType="private" />
        ) : (
          <ProfileLoader height={450} />
        )}
      </section>
      <section
        id="map-container"
        className={clsx(styles.mapContainer, {
          [styles.loading]: isMyForestLoading,
        })}
      >
        {!isMyForestLoading && userProfile ? (
          <ContributionsMap profilePageType="private" />
        ) : (
          <ProfileLoader height={450} />
        )}
      </section>
      <section
        id="progress-container"
        className={clsx(styles.progressContainer, {
          [styles.loading]: isMyForestLoading,
        })}
      >
        {!isMyForestLoading && userProfile ? (
          <ForestProgress profilePageType="private" />
        ) : (
          <ProfileLoader height={116} />
        )}
      </section>
      <section
        id="my-contributions-container"
        className={clsx(styles.myContributionsContainer, {
          [styles.loading]: isMyForestLoading,
        })}
      >
        {!isMyForestLoading && userProfile ? (
          <MyContributions
            profilePageType="private"
            userProfile={userProfile}
          />
        ) : (
          <ProfileLoader height={350} />
        )}
      </section>
      <section
        id="community-contributions-container"
        className={clsx(styles.communityContributionsContainer, {
          [styles.loading]: isMyForestLoading,
        })}
      >
        {!isMyForestLoading && userProfile ? (
          <CommunityContributions
            userProfile={userProfile}
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
