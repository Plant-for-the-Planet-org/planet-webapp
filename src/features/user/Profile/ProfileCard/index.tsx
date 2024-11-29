import type { ProfileV2Props } from '../../../common/types/profile';

import React from 'react';
import { Avatar } from '@mui/material';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './ProfileCard.module.scss';
import {
  DefaultUserProfileImage,
  SettingsIcon,
} from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import Link from 'next/link';
import ProfileActions from './ProfileActions';
import DonorCircleMemberBadge from './MicroComponents/DonorCircleMemberBadge';

const ProfileCard = ({ userProfile, profilePageType }: ProfileV2Props) => {
  const isPrivateAccount = profilePageType === 'private';
  const userImageUrl = userProfile?.image
    ? getImageUrl('profile', 'thumb', userProfile.image)
    : '';
  return (
    <div className={styles.profileCardContainer}>
      <div className={styles.profileBackground}>
        {isPrivateAccount && userProfile.isMember && <DonorCircleMemberBadge />}
      </div>
      <div className={styles.profilePicture}>
        {/* if no user profile picture exists or image is fetched from CDN in development env, show default profile image */}
        {userImageUrl && !userImageUrl.includes('development') ? (
          <Avatar alt={userProfile.displayName} src={userImageUrl} />
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
          <p>{userProfile?.bio}</p>
        </div>

        {profilePageType === 'private' ? (
          <ProfileActions profilePageType="private" userProfile={userProfile} />
        ) : (
          <ProfileActions profilePageType="public" userProfile={userProfile} />
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
