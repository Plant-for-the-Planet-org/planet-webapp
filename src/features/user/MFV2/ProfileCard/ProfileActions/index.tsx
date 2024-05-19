import React, { useState } from 'react';
import {
  AllDonations,
  RedeemIcon,
  SupportUserIcon,
  WebsiteLinkIcon,
} from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './ProfileActions.module.scss';
import RedeemModal from '../../../Profile/components/ProfileBox/microComponents/RedeemModal';
import SocialMediaShareButton from '../ShareModal/SocialMediaShareButton';
import { useTranslations } from 'next-intl';
import { ProfileV2Props } from '../../../../common/types/common';
import ProfileCardButton from '../ProfileCardButton';

const ProfileActions = ({ profileType, userProfile }: ProfileV2Props) => {
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

  return profileType === 'private' ? (
    <div className={styles.privateProfileActions}>
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
    <div className={styles.publicProfileActions}>
      <ProfileCardButton
        icon={<SupportUserIcon />}
        text={t('feature.supportUserText', {
          username: userProfile?.displayName.split(' ')[0],
        })}
        type={'primary'}
        isLink={'true'}
        href={`/s/${userProfile?.slug}`}
      />
      <div className={styles.websiteShareActions}>
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
