import React from 'react';
import ProfileCardButton from '.';
import {
  AllDonations,
  RedeemIcon,
  ShareIcon,
} from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './ProfileCardButton.module.scss';
import {
  SupportUserIcon,
  WebsiteLinkIcon,
} from '../../../../../../public/assets/images/ProfilePageIcons';

interface Props {
  isPrivate: boolean;
}

const ProfileCardButtonContainer = ({ isPrivate }: Props) => {
  return isPrivate ? (
    <div className={styles.privateProfileCardButtonContainer}>
      <ProfileCardButton icon={<AllDonations />} text={'All Donations'} />
      <ProfileCardButton icon={<RedeemIcon />} text={'Redeem'} />
      <ProfileCardButton icon={<ShareIcon />} text={'Share'} />
    </div>
  ) : (
    <div className={styles.publicProfileCardButtonContainer}>
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
  );
};

export default ProfileCardButtonContainer;
