import { useTranslations } from 'next-intl';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ProfileGridSkeleton from '../../../user/Profile/ProfileLayout/ProfileGridSkeleton';
import styles from './UserProfileLoader.module.scss';

/**
 * Full-page loader displayed while the user context is loading. It replaces the
 * entire UserLayout, so it reproduces the sidebar, the content frame, and the
 * profile grid to minimize cumulative layout shift (CLS).
 */
export const UserProfileLoader = () => {
  const t = useTranslations('Common');

  return (
    <div className={styles.loaderContainer} role="status" aria-live="polite">
      {/* Announced to assistive tech; the skeleton shapes below are decorative
          and marked aria-hidden individually so they stay direct flex children
          (a wrapper would collapse the content width). */}
      <span className={styles.visuallyHidden}>{t('loadingProfile')}</span>

      {/* Mobile burger placeholder (matches UserLayout .hamburgerIcon) */}
      <Skeleton className={styles.hamburgerSkeleton} borderRadius={10} />

      {/* Sidebar placeholder (matches UserLayout .sidebar) */}
      <aside className={styles.sidebarSkeleton} aria-hidden="true">
        {/* Top nav links: profile, payments, treemapper, planet-cash, widgets, settings */}
        <div className={styles.sidebarNavGroup}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.navRow}>
              <Skeleton circle width={20} height={20} />
            </div>
          ))}
        </div>
        {/* Bottom controls: language switcher, support pin, docs, logout */}
        <div className={styles.sidebarBottomGroup}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.navRow}>
              <Skeleton circle width={20} height={20} />
            </div>
          ))}
        </div>
      </aside>

      {/* Content frame (matches .profilePageWrapper + ProfileOuterContainer) */}
      <div className={styles.wrapper} aria-hidden="true">
        <div className={styles.outerContainer}>
          <ProfileGridSkeleton />
        </div>
      </div>
    </div>
  );
};
