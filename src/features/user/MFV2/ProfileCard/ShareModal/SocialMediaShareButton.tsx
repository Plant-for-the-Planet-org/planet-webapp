import React from 'react';
import { ShareIcon } from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import ProfileCardButton from '../ProfileCardButton';
import ShareModal from '.';
import { useTranslations } from 'next-intl';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ProfileProps } from '../../../../common/types/profile';

const SocialMediaShareButton = ({ userProfile }: ProfileProps) => {
  const [isShareModelOpen, setIsShareModelOpen] = React.useState(false);
  const { tenantConfig } = useTenant();
  const t = useTranslations('Donate');

  const webShareData = {
    title: t('shareTextTitle'),
    url: `${process.env.SCHEME}://${tenantConfig.config.tenantURL}/t/${userProfile?.slug}`,
    text: t('textToShare', { name: userProfile?.displayName }),
  };

  const isNativeShareSupported =
    navigator?.canShare && navigator.canShare(webShareData);

  const webShareMobile = async () => {
    try {
      await navigator.share(webShareData);
    } catch (error) {
      console.error(`Could not share at this time`, error);
    }
  };

  const handleNativeSocialMediaShare = () => {
    webShareMobile();
  };

  const handleShareModalOpen = () => {
    setIsShareModelOpen(true);
  };

  const handleShareModalClose = () => {
    setIsShareModelOpen(false);
  };

  return (
    <>
      <ProfileCardButton
        icon={<ShareIcon />}
        text={'Share'}
        onClick={
          isNativeShareSupported
            ? handleNativeSocialMediaShare
            : handleShareModalOpen
        }
      />
      {!isNativeShareSupported && (
        <ShareModal
          shareModalOpen={isShareModelOpen}
          handleShareModalClose={handleShareModalClose}
          userProfile={userProfile}
        />
      )}
    </>
  );
};

export default SocialMediaShareButton;
