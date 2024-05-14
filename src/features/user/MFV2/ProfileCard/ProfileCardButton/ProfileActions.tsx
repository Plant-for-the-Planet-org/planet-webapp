import React, { useState } from 'react';
import ProfileCardButton from '.';
import {
  AllDonations,
  RedeemIcon,
  SupportUserIcon,
  WebsiteLinkIcon,
} from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './ProfileCardButton.module.scss';
import RedeemModal from '../../../Profile/components/ProfileBox/microComponents/RedeemModal';
import SocialMediaShareButton from '../ShareModal/SocialMediaShareButton';
import { ProfileProps } from '../../../../common/types/profile';
import { useTranslations } from 'next-intl';

const ProfileActions = ({ authenticatedType, userProfile }: ProfileProps) => {
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const t = useTranslations('Profile');

  const handleRedeemModalOpen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };

  const handleWebsiteShareUrl = () => {
    const profileURL = userProfile?.url
      ? userProfile.url.includes('http') || userProfile.url.includes('https')
        ? userProfile.url
        : `http://${userProfile.url}`
      : '';
    return profileURL;
  };

  return authenticatedType === 'private' ? (
    <div className={styles.privateProfileCardButtonContainer}>
      <ProfileCardButton
        icon={<AllDonations />}
        text={t('feature.allDonations')}
        isLink={'true'}
        href={'/profile/history'}
      />
      <ProfileCardButton
        icon={<RedeemIcon />}
        text={t('feature.redeem')}
        onClick={handleRedeemModalOpen}
        isLink={'false'}
      />
      <RedeemModal
        redeemModalOpen={isRedeemModalOpen}
        handleRedeemModalClose={handleRedeemModalClose}
      />
      <SocialMediaShareButton userProfile={userProfile} />
    </div>
  ) : (
    <div className={styles.publicProfileCardButtonContainer}>
      <ProfileCardButton
        icon={<SupportUserIcon />}
        text={t('feature.supportUserText', {
          username: userProfile?.firstname,
        })}
        type={'primary'}
        isLink={'true'}
        href={`/s/${userProfile?.slug}`}
      />
      <div>
        <ProfileCardButton
          icon={<WebsiteLinkIcon />}
          text={t('feature.website')}
          isLink={'true'}
          href={handleWebsiteShareUrl()}
          target={'_blank'}
        />
        <SocialMediaShareButton userProfile={userProfile} />
      </div>
    </div>
  );
};

export default ProfileActions;
