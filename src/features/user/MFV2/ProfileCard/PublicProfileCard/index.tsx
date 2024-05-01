import React from 'react';
import styles from './PublicProfileCard.module.scss';
import { ProfileProps } from '../../../../common/types/profile';
import { Avatar } from '@mui/material';
import {
  DefaultProfileImage,
  SupportUserIcon,
  WebsiteLinkIcon,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import getImageUrl from '../../../../../utils/getImageURL';
import { ShareIcon } from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import ProfileCardButton from '../ProfileCardButton';

const PublicProfileCard = ({ userProfile }: ProfileProps) => {
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
            <DefaultProfileImage />
          )}
        </div>
        <h2>{userProfile?.displayName}</h2>
      </div>

      <div className={styles.profileCardButtonContainer}>
        <ProfileCardButton
          icon={<SupportUserIcon />}
          text={'Support Sophia by donating'}
          type={'primary'}
        />
        <div>
          <ProfileCardButton icon={<WebsiteLinkIcon />} text={'My Website'} />
          <ProfileCardButton icon={<ShareIcon />} text={'Share'} />
        </div>
      </div>
    </div>
  );
};

export default PublicProfileCard;
