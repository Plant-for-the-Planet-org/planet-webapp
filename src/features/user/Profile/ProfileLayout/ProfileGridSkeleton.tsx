import { clsx } from 'clsx';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import styles from './ProfileLayout.module.scss';

/**
 * Skeleton heights for each profile section. Kept here (next to the grid CSS)
 * so the loading placeholders and the real ProfileLayout stay in sync.
 */
export const PROFILE_SECTION_HEIGHTS = {
  profile: 450,
  map: 450,
  progress: 116,
  community: 350,
  myContributions: 350,
} as const;

/**
 * Full profile grid in its loading state. Rendered both by ProfileLayout while
 * the my-forest data loads and by UserProfileLoader while the user context
 * loads, so the two phases share identical geometry and avoid layout shift.
 */
const ProfileGridSkeleton = () => {
  return (
    <article className={styles.profileLayout}>
      <section className={styles.profileContainer}>
        <ProfileLoader height={PROFILE_SECTION_HEIGHTS.profile} />
      </section>
      <section className={clsx(styles.mapContainer, styles.loading)}>
        <ProfileLoader height={PROFILE_SECTION_HEIGHTS.map} />
      </section>
      <section className={clsx(styles.progressContainer, styles.loading)}>
        <ProfileLoader height={PROFILE_SECTION_HEIGHTS.progress} />
      </section>
      <section
        className={clsx(styles.communityContributionsContainer, styles.loading)}
      >
        <ProfileLoader height={PROFILE_SECTION_HEIGHTS.community} />
      </section>
      <section
        className={clsx(styles.myContributionsContainer, styles.loading)}
      >
        <ProfileLoader height={PROFILE_SECTION_HEIGHTS.myContributions} />
      </section>
    </article>
  );
};

export default ProfileGridSkeleton;
