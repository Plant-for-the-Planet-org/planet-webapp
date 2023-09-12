import myProfilestyle from '../../styles/MyProfile.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'next-i18next';
import { ProfileProps } from '../../../../common/types/profile';
import { ReactElement } from 'react';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

const UserInfo = ({ userProfile }: ProfileProps): ReactElement => {
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
          <div>
            {t('editProfile:member', {
              date: `${formatDate(userProfile?.created)}`,
            })}
          </div>
        </div>
      </div>
      {!router.query.id && (
        <div
          className={myProfilestyle.iconContainer}
          onClick={handleEditProfile}
        >
          <EditIcon className={myProfilestyle.icon} />
        </div>
      )}

      <div className={myProfilestyle.userDescription}>
        {userProfile?.bio && userProfile?.bio}
      </div>
    </>
  );
};

export default UserInfo;
