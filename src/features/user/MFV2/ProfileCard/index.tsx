import React from 'react';
import { ProfileProps } from '../../../common/types/profile';
import { Avatar } from '@mui/material';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './ProfileCard.module.scss';
import {
  DefaultUserProfileImage,
  SettingsIcon,
} from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { useLocale, useTranslations } from 'next-intl';
import ProfileActions from './ProfileCardButton/ProfileActions';
import Link from 'next/link';

const ProfileCard = ({ userProfile, authenticatedType }: ProfileProps) => {
  const t = useTranslations('Profile');
  const isPrivateAccount = authenticatedType === 'private';

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

        <ProfileActions
          authenticatedType={authenticatedType}
          userProfile={userProfile}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
