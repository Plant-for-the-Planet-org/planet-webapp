import React from 'react';
import { Avatar } from '@mui/material';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './ProfileCard.module.scss';
import {
  DefaultUserProfileImage,
  SettingsIcon,
} from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ProfileV2Props } from '../../../common/types/common';
import ProfileActions from './ProfileActions';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';

const ProfileCard = ({ userProfile, profileType }: ProfileV2Props) => {
  const t = useTranslations('Profile');
  const isPrivateAccount = profileType === 'private';
  const userImageUrl = getImageUrl('profile', 'avatar', userProfile?.image);
  return userProfile ? (
    <div className={styles.profileCardContainer}>
      <div className={styles.profileBackground}></div>
      <div className={styles.profilePicture}>
        {/* if no user profile picture exists or image is fetched from CDN in development env, show default profile image */}
        {userProfile?.image && !userImageUrl.includes('development') ? (
          <Avatar alt={userProfile.slug || 'user Image'} src={userImageUrl} />
        ) : (
          <Avatar>
            <DefaultUserProfileImage />
          </Avatar>
        )}
      </div>
      <div className={styles.profileDetailsContainer}>
        {isPrivateAccount && (
          <Link href="/profile/edit">
            <button className={styles.editProfileIcon}>
              <SettingsIcon />
            </button>
          </Link>
        )}
        <div className={styles.profileNameAndDescriptionContainer}>
          <h2>{userProfile?.displayName}</h2>
          <p>
            {t('myProfile.userDescription', {
              bio: userProfile?.bio,
            })}
          </p>
        </div>

        <ProfileActions profileType={profileType} userProfile={userProfile} />
      </div>
    </div>
  ) : (
    <ProfileLoader />
  );
};

export default ProfileCard;
