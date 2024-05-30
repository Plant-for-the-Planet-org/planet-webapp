import styles from './PublicProfileLayout.module.scss';
import ProfileCard from '../ProfileCard';
import { UserPublicProfile } from '@planet-sdk/common';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import ContributionsMap from '../ContributionsMap';
import CommunityContributions from '../CommunityContributions';
interface Props {
  profile: UserPublicProfile;
}

// We may choose to accept the components for each section as props depending on how we choose to pass data. In that case, we would need to add an interface to accept the components as props.
const PublicProfileLayout = ({ profile }: Props) => {
  const showLeaderboard = true;
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
        Progress
      </section>
      <section
        id="my-contributions-container"
        className={styles.myContributionsContainer}
      ></section>
      {showLeaderboard ? (
        <section
          id="community-contributions-container"
          className={styles.communityContributionsContainer}
        >
          {profile ? (
            <CommunityContributions
              userProfile={profile}
              profileType="public"
            />
          ) : (
            <ProfileLoader />
          )}
        </section>
      ) : null}
      <section id="info-cta-container" className={styles.infoAndCtaContainer}>
        Additional information and CTAs - Become a member, Treegame, SDG Slider
      </section>
    </article>
  );
};

export default PublicProfileLayout;
