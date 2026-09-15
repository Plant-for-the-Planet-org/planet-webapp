import type { ReactElement } from 'react';

import { clsx } from 'clsx';
import { SkeletonBlock } from '../common/ContentLoaders/Skeleton';
import ProjectSnippetSkeleton from './ProjectSnippet/ProjectSnippetSkeleton';
import styles from './ProjectsSectionSkeleton.module.scss';

interface ProjectsSectionSkeletonProps {
  isMobile: boolean;
  /** Real, already-known tenant flag: when true the tabs row is replaced by a single header line, matching ProjectListControls. */
  shouldHideProjectTabs: boolean;
}

const DESKTOP_CARD_COUNT = 4;
const MOBILE_CARD_COUNT = 3;

/** Loading shape for the root project-list page: mirrors ProjectListControls (tabs + search/filter) above a column of ProjectSnippet cards. */
export default function ProjectsSectionSkeleton({
  isMobile,
  shouldHideProjectTabs,
}: ProjectsSectionSkeletonProps): ReactElement {
  const cardCount = isMobile ? MOBILE_CARD_COUNT : DESKTOP_CARD_COUNT;

  return (
    <div className={styles.container} aria-hidden="true">
      {isMobile ? (
        <div className={styles.controlsMobile}>
          {!shouldHideProjectTabs && (
            <SkeletonBlock width={130} height={28} borderRadius={5} />
          )}
          <div className={styles.iconsMobile}>
            <SkeletonBlock width={28} height={28} borderRadius={8} />
            <SkeletonBlock width={28} height={28} borderRadius={8} />
          </div>
          <SkeletonBlock width={90} height={28} borderRadius={5} />
        </div>
      ) : (
        <div className={styles.controls}>
          {shouldHideProjectTabs ? (
            <SkeletonBlock width={220} height={16} />
          ) : (
            <SkeletonBlock width={200} height={24} borderRadius={12} />
          )}
          <SkeletonBlock width={40} height={24} borderRadius={12} />
        </div>
      )}
      <div
        className={clsx(styles.cardList, { [styles.cardListMobile]: isMobile })}
      >
        {Array.from({ length: cardCount }, (_, index) => (
          <ProjectSnippetSkeleton key={index} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}
