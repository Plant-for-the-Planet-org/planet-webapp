import type { ReactElement } from 'react';

import { SkeletonBlock } from './Skeleton';
import styles from './GenericPageSkeleton.module.scss';

/**
 * Content-agnostic placeholder shown inside UserLayout when a route has not
 * supplied its own `skeleton`. Only a title bar and one content block, so it
 * never implies a shape that belongs to some other page.
 */
export default function GenericPageSkeleton(): ReactElement {
  return (
    <div className={styles.container} aria-hidden="true">
      <SkeletonBlock height={32} width={240} />
      <SkeletonBlock height={200} />
    </div>
  );
}
