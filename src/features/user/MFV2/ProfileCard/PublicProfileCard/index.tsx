import React from 'react';
import styles from './PublicProfileCard.module.scss';
import { ProfileProps } from '../../../../common/types/profile';
import { Avatar } from '@mui/material';
import { DefaultUserProfileImage } from '../../../../../../public/assets/images/ProfilePageIcons';
import getImageUrl from '../../../../../utils/getImageURL';
import ProfileCardButtonContainer from '../ProfileCardButton/ProfileCardButtonContainer';
import { useTranslations } from 'next-intl';

const PublicProfileCard = ({ userProfile }: ProfileProps) => {
  const t = useTranslations('Profile');
  return (
    <div className={styles.profileCardContainer}>
      <div className={styles.profileCardDetails}>
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
        <h2>{userProfile?.displayName}</h2>
        <p>
          {t('myProfile.userDescription', {
            bio: userProfile?.bio,
          })}
        </p>
      </div>

      <ProfileCardButtonContainer
        authenticatedType={'public'}
        userProfile={userProfile}
      />
    </div>
  );
};

export default PublicProfileCard;
