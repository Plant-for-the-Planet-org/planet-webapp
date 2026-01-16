import getImageUrl from '../../../../../utils/getImageURL';
import { useUserProps } from '../../UserPropsContext';
import DefaultProfileImageIcon from '../../../../../../public/assets/images/icons/headerIcons/DefaultProfileImageIcon';
import SignInButton from './SignInButton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../Navbar.module.scss';
import useLocalizedPath from '../../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useAuthSession } from '../../../../../hooks/useAuthSession';

const ProfileIconSkeleton = () => {
  return (
    <div className={styles.profileIconSkeleton}>
      <Skeleton />
    </div>
  );
};

const UserProfileButton = () => {
  const { user } = useUserProps();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { isAuthenticated, isAuthLoading } = useAuthSession();

  if (isAuthLoading) {
    return <ProfileIconSkeleton />;
  }

  if (!isAuthenticated) {
    return <SignInButton />;
  }

  if (!user) {
    return null;
  }

  return (
    <button
      className={styles.profileImageButton}
      onClick={() => router.push(localizedPath('/profile'))}
    >
      {user.image ? (
        <img src={getImageUrl('profile', 'thumb', user.image)} alt="Profile" />
      ) : (
        <div className={styles.userDefaultIconContainer}>
          <DefaultProfileImageIcon />
        </div>
      )}
    </button>
  );
};

export default UserProfileButton;
