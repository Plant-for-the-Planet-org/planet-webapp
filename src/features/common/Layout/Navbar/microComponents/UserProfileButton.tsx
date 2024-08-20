import getImageUrl from '../../../../../utils/getImageURL';
import { useUserProps } from '../../UserPropsContext';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import DefaultProfileImageIcon from '../../../../../../public/assets/images/icons/headerIcons/DefaultProfileImageIcon';
import SignInButton from './SignInButton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProfileIconSkeleton = () => {
  return (
    <div className="ProfileIconSkeleton">
      <Skeleton />
    </div>
  );
};

const UserProfileButton = () => {
  const { user } = useUserProps();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
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
      className="profileImageButton"
      onClick={() => router.push(`/profile`)}
    >
      {user.image ? (
        <img src={getImageUrl('profile', 'thumb', user.image)} alt="Profile" />
      ) : (
        <div className="userDefaultIconContainer">
          <DefaultProfileImageIcon />
        </div>
      )}
    </button>
  );
};

export default UserProfileButton;
