import myProfilestyle from '../../styles/MyProfile.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ProfileProps } from '../../../../common/types/profile';
import { ReactElement } from 'react';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import Link from 'next/link';
import { EditTargetSvg } from '../../../../../../public/assets/images/ProfilePageIcons';

const UserInfo = ({ userProfile }: ProfileProps): ReactElement => {
  const { t } = useTranslation(['editProfile']);
  const router = useRouter();
  const stringAvatar = (name: string) => {
    const cleanedName = name.replace(/[^a-zA-Z ]/g, ' ');
    return {
      children: `${cleanedName.split(' ')[0][0]}${
        cleanedName.split(' ')[1][0]
      }`,
    };
  };
  return (
    <>
      <div
        className={myProfilestyle.userInfoContainer}
        style={{ position: 'relative' }}
      >
        {userProfile?.image ? (
          <Avatar
            alt="user Image"
            src={getImageUrl('profile', 'avatar', userProfile?.image)}
            sx={{ width: 65, height: 65 }}
          />
        ) : (
          <Avatar {...stringAvatar(`${userProfile?.displayName}`)} />
        )}

        <div>
          <div className={myProfilestyle.userInfo}>
            {userProfile?.displayName}
          </div>
          <div>
            {t('editProfile:memberSince', {
              date: `${formatDate(userProfile?.created)}`,
            })}
          </div>
        </div>
      </div>
      {userProfile && router.pathname === '/profile' && (
        <div className={myProfilestyle.iconContainer}>
          <Link href="profile/edit">
            <div className={myProfilestyle.icon}>
              <EditTargetSvg color="#007A49" />
            </div>
          </Link>
        </div>
      )}

      <div className={myProfilestyle.userDescription}>
        {userProfile?.bio && userProfile?.bio}
      </div>
    </>
  );
};

export default UserInfo;
