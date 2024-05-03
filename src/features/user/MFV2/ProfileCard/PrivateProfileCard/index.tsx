import React from 'react';
import { ProfileProps } from '../../../../common/types/profile';
import { Avatar } from '@mui/material';
import getImageUrl from '../../../../../utils/getImageURL';
import { DefaultUserProfileImage } from '../../../../../../public/assets/images/ProfilePageIcons';
import styles from './PrivateProfileCard.module.scss';
import { SettingsIcon } from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { useLocale, useTranslations } from 'next-intl';
import ProfileCardButtonContainer from '../ProfileCardButton/ProfileCardButtonContainer';
import { useRouter } from 'next/router';

const PrivateProfileCard = ({ userProfile }: ProfileProps) => {
  const t = useTranslations('Profile');
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const router = useRouter();
  const locale = useLocale();
  const isPublicAccount = router.asPath === `/${locale}/profile/mfv2-public`;

  return (
    <div className={styles.profileCardContainer}>
      <div className={styles.profileBackground}></div>
      <div className={styles.profilePicture}>
        {userProfile?.image ? (
          <Avatar
            alt="user Image"
            src={getImageUrl('profile', 'avatar', userProfile?.image)}
            className={styles.avatar}
          />
        ) : (
          <DefaultUserProfileImage />
        )}
      </div>
      <div className={styles.profileDetailsContainer}>
        {!isPublicAccount && (
          <button className={styles.editProfileIcon}>
            <SettingsIcon />
          </button>
        )}
        <div className={styles.profileInfo}>
          <h2>{userProfile?.displayName}</h2>
          <p>
            {/* {t('myProfile.userDescription', {
              bio: userProfile?.bio,
            })} */}
            {userProfile?.bio}
          </p>
        </div>

        {isPublicAccount && isMobile ? (
          // renders public account features for mobile screen
          <ProfileCardButtonContainer
            authenticatedType={'public'}
            userProfile={userProfile}
          />
        ) : (
          <ProfileCardButtonContainer
            authenticatedType={'private'}
            userProfile={userProfile}
          />
        )}
      </div>
    </div>
  );
};

export default PrivateProfileCard;
