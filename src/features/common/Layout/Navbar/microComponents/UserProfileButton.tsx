import getImageUrl from '../../../../../utils/getImageURL';
import DefaultProfileImageIcon from '../../../../../../public/assets/images/icons/headerIcons/DefaultProfileImageIcon';
import SignInButton from './SignInButton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../Navbar.module.scss';
import useLocalizedPath from '../../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useAuthSession } from '../../../../../hooks/useAuthSession';
import { useUserStore } from '../../../../../stores';

const ProfileIconSkeleton = () => {
  return (
    <div className={styles.profileIconSkeleton}>
      <Skeleton />
    </div>
  );
};

const UserProfileButton = () => {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { isAuthenticated, isAuthLoading } = useAuthSession();
  //store: state
  const userProfile = useUserStore((state) => state.userProfile);

  if (isAuthLoading) {
    return <ProfileIconSkeleton />;
  }

  if (!isAuthenticated) {
    return <SignInButton />;
  }

  if (!userProfile) {
    return null;
  }

  return (
    <button
      className={styles.profileImageButton}
      onClick={() => router.push(localizedPath('/profile'))}
    >
      {userProfile.image ? (
        <img
          src={getImageUrl('profile', 'thumb', userProfile.image)}
          alt="Profile"
        />
      ) : (
        <div className={styles.userDefaultIconContainer}>
          <DefaultProfileImageIcon />
        </div>
      )}
    </button>
  );
};

export default UserProfileButton;
