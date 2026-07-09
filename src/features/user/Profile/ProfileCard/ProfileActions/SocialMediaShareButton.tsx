import type { ProfileV2Props } from '../../../../common/types/profile';

import { useState } from 'react';
import { ShareIcon } from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import WebappButton from '../../../../common/WebappButton';
import ShareModal from '../ShareModal';
import { useTranslations } from 'next-intl';
import { useTenantStore } from '../../../../../stores/tenantStore';

interface SocialMediaShareButtonProps {
  userProfile: ProfileV2Props['userProfile'];
}

const SocialMediaShareButton = ({
  userProfile,
}: SocialMediaShareButtonProps) => {
  const t = useTranslations('Profile');
  // local state
  const [isShareModelOpen, setIsShareModelOpen] = useState(false);
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  const webShareData = {
    title: t('shareFeature.shareTextTitle'),
    url: `${process.env.SCHEME}://${tenantConfig.config.tenantURL}/t/${userProfile?.slug}`,
    text: t('shareFeature.textToShare', { name: userProfile?.displayName }),
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
      <WebappButton
        icon={<ShareIcon />}
        text={t('feature.share')}
        onClick={
          isNativeShareSupported
            ? handleNativeSocialMediaShare
            : handleShareModalOpen
        }
        elementType="button"
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
