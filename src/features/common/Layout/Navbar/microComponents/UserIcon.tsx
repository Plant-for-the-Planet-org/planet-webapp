import getImageUrl from '../../../../../utils/getImageURL';
import { useUserProps } from '../../UserPropsContext';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import DefaultProfileImageIcon from '../../../../../../public/assets/images/icons/headerIcons/DefaultProfileImageIcon';
import SignInButton from './SignInButton';

const UserIcon = () => {
  const { user } = useUserProps();
  const router = useRouter();
  const { isAuthenticated } = useAuth0();

  return user ? (
    <button
      className="profileImageButton"
      onClick={() => router.push(`/profile`)}
    >
      {user.image ? (
        <img
          src={getImageUrl('profile', 'avatar', user.image)}
          style={{ borderRadius: '40px' }}
        />
      ) : (
        <DefaultProfileImageIcon width={'110px'} />
      )}
    </button>
  ) : !isAuthenticated ? (
    <SignInButton />
  ) : (
    <></>
  );
};

export default UserIcon;
