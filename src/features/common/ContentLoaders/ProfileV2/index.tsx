import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './profileV2ContentLoaders.module.scss';

export const ProfileLoader = ({ height }: { height: number }) => {
  return (
    <div className={styles.profileCardSkeleton}>
      <Skeleton height={height} />
    </div>
  );
};
