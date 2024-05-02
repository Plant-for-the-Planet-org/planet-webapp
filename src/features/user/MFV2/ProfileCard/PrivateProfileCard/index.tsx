import React from 'react';
import { ProfileProps } from '../../../../common/types/profile';
import { Avatar } from '@mui/material';
import getImageUrl from '../../../../../utils/getImageURL';
import { DefaultUserProfileImage } from '../../../../../../public/assets/images/ProfilePageIcons';
import styles from './PrivateProfileCard.module.scss';
import { SettingsIcon } from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { useTranslations } from 'next-intl';
import ProfileCardButtonContainer from '../ProfileCardButton/ProfileCardButtonContainer';

const PrivateProfileCard = ({ userProfile }: ProfileProps) => {
  const t = useTranslations('Profile');

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
        <button className={styles.editProfileIcon}>
          <SettingsIcon />
        </button>
        <div className={styles.profileInfo}>
          <h2>{userProfile?.displayName}</h2>
          <p>
            {/* {t('myProfile.userDescription', {
              bio: userProfile?.bio,
            })} */}
            {userProfile?.bio}
          </p>
        </div>
        <ProfileCardButtonContainer isPrivate={true} />
      </div>
    </div>
  );
};

export default PrivateProfileCard;
