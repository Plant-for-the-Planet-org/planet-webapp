import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './profileV2ContentLoaders.module.scss';

export const ProfileLoader = () => {
  return (
    <div className={styles.profileCardSkeleton}>
      <Skeleton height={350} />
    </div>
  );
};
