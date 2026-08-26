import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { SkeletonBlock, SkeletonCircle } from '../Skeleton';
import GenericPageSkeleton from '../GenericPageSkeleton';
import styles from './UserLayoutLoader.module.scss';

interface UserLayoutLoaderProps {
  /**
   * The shape of the page being navigated to. Falls back to a minimal,
   * content-agnostic placeholder when the route hasn't supplied one, rather
   * than defaulting to any single page's shape.
   */
  skeleton?: ReactNode;
}

/**
 * Full-page loader displayed while the user context is loading. It replaces the
 * entire UserLayout, so it reproduces the sidebar and the content frame to
 * minimize cumulative layout shift (CLS). It owns only that shared chrome;
 * the content area shows whatever skeleton the destination route supplies.
 */
export const UserLayoutLoader = ({ skeleton }: UserLayoutLoaderProps) => {
  const t = useTranslations('Common');

  return (
    <div className={styles.loaderContainer} role="status" aria-live="polite">
      {/* Announced to assistive tech; the skeleton shapes below are decorative
          and marked aria-hidden individually so they stay direct flex children
          (a wrapper would collapse the content width). */}
      <span className={styles.visuallyHidden}>{t('loadingProfile')}</span>

      {/* Mobile burger placeholder. Wrapped in aria-hidden to avoid exposing
    decorative loading UI to screen readers. */}
      <span aria-hidden="true">
        <SkeletonBlock className={styles.hamburgerSkeleton} borderRadius={10} />
      </span>

      {/* Sidebar placeholder (matches UserLayout .sidebar) */}
      <aside className={styles.sidebarSkeleton} aria-hidden="true">
        {/* Top nav links: profile, payments, treemapper, planet-cash, widgets, settings */}
        <div className={styles.sidebarNavGroup}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.navRow}>
              <SkeletonCircle size={20} />
            </div>
          ))}
        </div>
        {/* Bottom controls: language switcher, support pin, docs, logout */}
        <div className={styles.sidebarBottomGroup}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.navRow}>
              <SkeletonCircle size={20} />
            </div>
          ))}
        </div>
      </aside>

      {/* Content frame (matches .profilePageWrapper). The route-specific
          skeleton renders inside, so this stays content-agnostic. */}
      <div className={styles.wrapper}>
        {skeleton ?? <GenericPageSkeleton />}
      </div>
    </div>
  );
};
