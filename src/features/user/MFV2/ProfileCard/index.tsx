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

const ProfileCard = ({ userProfile }: ProfileProps) => {
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
          {/* <SettingsIcon
            width={18}
            gearColor="#007A49"
            gearCenterColor="transparent"
          /> */}
          <SettingsIcon />
        </button>
        <div className={styles.profileInfo}>
          <h2>Paul Sanchez</h2>
          <p>
            I grew up planting trees with Plant-for-the-Planet and since 2008,
            we’ve planted over 6 Million trees near my hometown in Yucatan, Join
            the app, and plant some more!
          </p>
          {/* buttons */}
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
