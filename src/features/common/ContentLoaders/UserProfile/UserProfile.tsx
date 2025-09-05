import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './UserProfileLoader.module.scss';

export const UserProfileLoader = () => {
  return (
    <>
      <div className={styles.skeletonContainer}>
        <Skeleton height={300} className={styles.profileSkeleton} />
        <Skeleton height={700} className={styles.myForestMapSkeleton} />
      </div>
    </>
  );
};
