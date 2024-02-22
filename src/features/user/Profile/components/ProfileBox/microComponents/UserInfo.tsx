import myProfilestyle from '../../../styles/MyProfile.module.scss';
import getImageUrl from '../../../../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ProfileProps } from '../../../../../common/types/profile';
import { ReactElement } from 'react';
import formatDate from '../../../../../../utils/countryCurrency/getFormattedDate';
import Link from 'next/link';
import {
  DefaultProfileImage,
  EditTargetSvg,
} from '../../../../../../../public/assets/images/ProfilePageIcons';

const UserInfo = ({ userProfile }: ProfileProps): ReactElement => {
  const t = useTranslations('Profile');
  const router = useRouter();

  return (
    <>
      <div className={myProfilestyle.userInfoContainer}>
        {userProfile?.image ? (
          <Avatar
            alt="user Image"
            src={getImageUrl('profile', 'avatar', userProfile?.image)}
            className={myProfilestyle.avatarRoot}
          />
        ) : (
          <DefaultProfileImage />
        )}
        <div className={myProfilestyle.userInfoMainContainer}>
          <div className={myProfilestyle.userInfo}>
            {userProfile?.displayName}
          </div>
          <div>
            {t('myProfile.memberSince', {
              date: `${formatDate(userProfile?.created)}`,
            })}
          </div>
        </div>
      </div>
      {userProfile?.supportPin && router.asPath === '/profile' && (
        <div className={myProfilestyle.iconContainer}>
          <Link href="/profile/edit">
            <div className={myProfilestyle.icon}>
              <EditTargetSvg color="#007A49" />
            </div>
          </Link>
        </div>
      )}

      <div className={myProfilestyle.userDescription}>
        {t('myProfile.userDescription', {
          bio: userProfile?.bio,
        })}
      </div>
    </>
  );
};

export default UserInfo;
