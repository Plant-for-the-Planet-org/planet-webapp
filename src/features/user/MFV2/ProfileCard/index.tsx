import React from 'react';
import { ProfileProps } from '../../../common/types/profile';
import { Avatar } from '@mui/material';
import getImageUrl from '../../../../utils/getImageURL';
import { DefaultProfileImage } from '../../../../../public/assets/images/ProfilePageIcons';
import styles from './ProfileCard.module.scss';
import {
  AllDonations,
  RedeemIcon,
  SettingsIcon,
  ShareIcon,
} from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import ProfileCardButton from './ProfileCardButton';
import { useTranslations } from 'next-intl';

const ProfileCard = ({ userProfile }: ProfileProps) => {
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
          <DefaultProfileImage />
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
        <div className={styles.profileCardButtonContainer}>
          <ProfileCardButton icon={<AllDonations />} text={'All Donations'} />
          <ProfileCardButton icon={<RedeemIcon />} text={'Redeem'} />
          <ProfileCardButton icon={<ShareIcon />} text={'Share'} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
