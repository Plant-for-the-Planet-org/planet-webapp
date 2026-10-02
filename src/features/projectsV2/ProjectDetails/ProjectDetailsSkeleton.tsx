import type { ReactElement } from 'react';

import { clsx } from 'clsx';
import { SkeletonBlock } from '../../common/ContentLoaders/Skeleton';
import ProjectSnippetSkeleton from '../ProjectSnippet/ProjectSnippetSkeleton';
import styles from './ProjectDetailsSkeleton.module.scss';

interface ProjectDetailsSkeletonProps {
  isMobile?: boolean;
}

const CONTACT_ROW_COUNT = 4;

/**
 * Loading shape for the project-details route: the ProjectSnippet header
 * card, then the info panel's always-present sections (about, image
 * gallery, contact details). Other sections (reviews, key info, additional
 * info, downloads) depend on project data we don't have yet, so they're
 * left out rather than guessed at.
 */
export default function ProjectDetailsSkeleton({
  isMobile = false,
}: ProjectDetailsSkeletonProps): ReactElement {
  return (
    <div className={styles.container} aria-hidden="true">
      <ProjectSnippetSkeleton isMobile={isMobile} />
      <div
        className={clsx(styles.infoPanel, {
          [styles.infoPanelMobile]: isMobile,
        })}
      >
        <div className={styles.aboutSection}>
          <SkeletonBlock width={140} height={20} />
          <SkeletonBlock height={14} count={3} />
        </div>
        <SkeletonBlock height={192} borderRadius={12} />
        <div className={styles.contactSection}>
          <SkeletonBlock width={160} height={20} />
          {Array.from({ length: CONTACT_ROW_COUNT }, (_, index) => (
            <SkeletonBlock key={index} height={41} borderRadius={8} />
          ))}
        </div>
      </div>
    </div>
  );
}
