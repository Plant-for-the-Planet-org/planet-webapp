import type { ReactElement } from 'react';

import { clsx } from 'clsx';
import { SkeletonBlock } from '../../common/ContentLoaders/Skeleton';
import styles from './ProjectSnippetSkeleton.module.scss';

interface ProjectSnippetSkeletonProps {
  /** Matches ProjectSnippet's own `.singleProject` phone-view override: full width, no shadow. */
  isMobile?: boolean;
}

/** Mirrors a single ProjectSnippet card: image, progress bar, info row, TPO footer. */
export default function ProjectSnippetSkeleton({
  isMobile = false,
}: ProjectSnippetSkeletonProps): ReactElement {
  return (
    <div className={clsx(styles.card, { [styles.cardMobile]: isMobile })}>
      <SkeletonBlock height={160} />
      <SkeletonBlock height={4} />
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoText}>
          <SkeletonBlock width={140} height={16} />
          <SkeletonBlock width={90} height={12} />
        </div>
        <SkeletonBlock width={50} height={16} />
      </div>
      <SkeletonBlock height={30} />
    </div>
  );
}
