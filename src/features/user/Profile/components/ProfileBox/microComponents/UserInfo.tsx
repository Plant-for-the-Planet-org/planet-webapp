import myProfilestyle from '../../../styles/MyProfile.module.scss';
import getImageUrl from '../../../../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ProfileProps } from '../../../../../common/types/profile';
import { ReactElement } from 'react';
import formatDate from '../../../../../../utils/countryCurrency/getFormattedDate';
import Link from 'next/link';
import {
  DefaultProfileImage,
  EditTargetSvg,
} from '../../../../../../../public/assets/images/ProfilePageIcons';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';

const UserInfo = ({ userProfile }: ProfileProps): ReactElement => {
  const { t, ready } = useTranslation(['profile']);
  // User represents the logged in user, or the impersonated user in impersonation mode
  const { user: verifiedUser } = useUserProps();
  const router = useRouter();

  return ready ? (
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
            {t('profile:myProfile.memberSince', {
              date: `${formatDate(userProfile?.created)}`,
            })}
          </div>
        </div>
      </div>
      {userProfile?.id === verifiedUser?.id && router.asPath === '/profile' && (
        <div className={myProfilestyle.iconContainer}>
          <Link href="/profile/edit">
            <div className={myProfilestyle.icon}>
              <EditTargetSvg color="#007A49" />
            </div>
          </Link>
        </div>
      )}

      <div className={myProfilestyle.userDescription}>
        {t('profile:myProfile.userDescription', {
          bio: userProfile?.bio,
        })}
      </div>
    </>
  ) : (
    <></>
  );
};

export default UserInfo;
