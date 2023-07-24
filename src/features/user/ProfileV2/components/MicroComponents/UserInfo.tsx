import myProfilestyle from '../../styles/MyProfile.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'next-i18next';

const UserInfo = ({ userProfile }) => {
  const { t } = useTranslation(['editProfile']);
  const router = useRouter();
  const handleEditProfile = () => {
    router.push('profile/edit');
  };
  return (
    <>
      <div
        className={myProfilestyle.userInfoContainer}
        style={{ position: 'relative' }}
      >
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
    </>
  );
};

export default UserInfo;
