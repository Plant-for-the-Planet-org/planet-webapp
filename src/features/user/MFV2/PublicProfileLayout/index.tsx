import styles from './PublicProfileLayout.module.scss';
import ProfileCard from '../ProfileCard';
import { UserPublicProfile } from '@planet-sdk/common';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ForestProgress from '../ForestProgress';
import ContributionsMap from '../ContributionsMap';
import { useState, useEffect, useContext } from 'react';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import { handleError, APIError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';

interface Props {
  tenantConfigId: string;
}

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const PublicProfileLayout = ({ tenantConfigId }: Props) => {
  const [profile, setProfile] = useState<null | UserPublicProfile>();
  const { user, contextLoaded } = useUserProps();
  const router = useRouter();
  const { setUserInfo } = useMyForestV2();
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

  return (
    <article className={styles.publicProfileLayout}>
      <section id="profile-container" className={styles.profileContainer}>
        {profile ? (
          <ProfileCard userProfile={profile} profileType="public" />
        ) : (
          <ProfileLoader />
        )}
      </section>
      <section id="map-container" className={styles.mapContainer}>
        <ContributionsMap />
      </section>
      <section id="progress-container" className={styles.progressContainer}>
        <ForestProgress />
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
