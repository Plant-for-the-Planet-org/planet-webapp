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
import { useRouter } from 'next/router';
import SocialMediaShareButton from '../ShareModal/SocialMediaShareButton';
import { ProfileProps } from '../../../../common/types/profile';
import { useTranslations } from 'next-intl';

const ProfileCardButtonContainer = ({
  authenticatedType,
  userProfile,
}: ProfileProps) => {
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('Profile');

  const handleRedeemModalOpen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };

  const handleSupport = (): void => {
    router.push(`/s/${userProfile?.slug}`);
  };

  const handleWebsiteShareUrl = () => {
    const profileURL = userProfile?.url
      ? userProfile.url.includes('http') || userProfile.url.includes('https')
        ? userProfile.url
        : `http://${userProfile.url}`
      : '';
    if (profileURL) window.open(profileURL, '_blank');
  };

  return authenticatedType === 'private' ? (
    <div className={styles.privateProfileCardButtonContainer}>
      <ProfileCardButton
        icon={<AllDonations />}
        text={t('feature.allDonations')}
        onClick={() => router.push('/profile/history')}
      />
      <ProfileCardButton
        icon={<RedeemIcon />}
        text={t('feature.redeem')}
        onClick={handleRedeemModalOpen}
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
        onClick={handleSupport}
      />
      <div>
        <ProfileCardButton
          icon={<WebsiteLinkIcon />}
          text={t('feature.website')}
          onClick={handleWebsiteShareUrl}
        />
        <SocialMediaShareButton userProfile={userProfile} />
      </div>
    </div>
  );
};

export default ProfileCardButtonContainer;
