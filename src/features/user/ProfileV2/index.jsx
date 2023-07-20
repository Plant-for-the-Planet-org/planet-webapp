import { Avatar } from '@mui/material';
import ProfileContainer from './styles/ProfileContainer';
import { useTranslation } from 'next-i18next';
import EditIcon from '@mui/icons-material/Edit';
import getImageUrl from '../../../utils/getImageURL';
import myProfilestyle from './styles/MyProfile.module.scss';
import { useRouter } from 'next/router';
import FeaturesForPrivateAccount from './components/userFeatures/FeaturesForPrivateAccount';

const Profile = ({ userProfile }) => {
  const { t } = useTranslation(['editProfile', 'redeem', 'me']);
  const router = useRouter();
  const handleEditProfile = () => {
    router.push('profile/edit');
  };

  return (
    <ProfileContainer>
      <div className={myProfilestyle.userInfoContainer}>
        <Avatar
          alt="user Image"
          src={getImageUrl('profile', 'avatar', userProfile?.image)}
          sx={{ width: 65, height: 65 }}
        />

        <div>
          <div className={myProfilestyle.userInfo}>
            {userProfile?.displayName}
          </div>
          <div>{t('editProfile:member', { date: 'May 2012' })}</div>
        </div>
      </div>
      <div className={myProfilestyle.iconContainer} onClick={handleEditProfile}>
        <EditIcon className={myProfilestyle.icon} />
      </div>

      <div className={myProfilestyle.userDescription}>
        {userProfile?.bio && userProfile?.bio}
      </div>
      {userProfile.isPrivate && <FeaturesForPrivateAccount />}
    </ProfileContainer>
  );
};

export default Profile;
