import myProfileStyle from '../../styles/MyProfile.module.scss';
import { Button } from '@mui/material';
import { SupportSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import tenantConfig from '../../../../../../tenant.config';
import { useRouter } from 'next/router';
import Share from '../MicroComponents/Share';
import { UserFeaturesProps } from '../../../../common/types/profile';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import RedeemModal from './RedeemModal';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';

const config = tenantConfig();

const UserFeatures = ({
  handleShare,
  userProfile,
  showSocialButton,
  setShowSocialButton,
}: UserFeaturesProps) => {
  const router = useRouter();
  const { t } = useTranslation(['me']);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const handleSupport = () => {
    router.push(`/s/${userProfile.slug}`);
  };

  const handleShareOnLinkedIn = () => {
    if (config && userProfile) {
      const linkToShare = `${config.tenantURL}/t/${userProfile.slug}`;
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`;
      window.open(shareUrl, '_blank');
    }
  };

  const handleRegisterTree = () => {
    router.push('profile/register-trees');
  };

  const handleRedeemModalOPen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };

  return (
    <div className={myProfileStyle.buttonContainer}>
      {userProfile?.type !== 'tpo' && router.pathname !== '/profile' && (
        <Button
          variant="contained"
          startIcon={<SupportSvg color={'#FFFFFF'} />}
          onClick={handleSupport}
        >
          {t('me:support')}
        </Button>
      )}

      {!userProfile.isPrivate && router.pathname !== '/profile' && (
        <Button
          variant="contained"
          startIcon={<LinkedInIcon />}
          onClick={handleShareOnLinkedIn}
        >
          {t('me:linkedIn')}
        </Button>
      )}
      <Button
        variant="contained"
        startIcon={<RedeemCodeSvg color={'#FFFFFF'} />}
        onClick={handleRedeemModalOPen}
      >
        {t('redeem:redeem')}
      </Button>
      <RedeemModal
        redeemModalOpen={isRedeemModalOpen}
        handleRedeemModalClose={handleRedeemModalClose}
      />
      <Button
        variant="contained"
        startIcon={<RegisteredTreeSvg color={'#FFFFFF'} />}
        onClick={handleRegisterTree}
      >
        {t('me:registerTrees')}
      </Button>

      <Share
        handleShare={handleShare}
        userProfile={userProfile}
        showSocialButton={showSocialButton}
        setShowSocialButton={setShowSocialButton}
      />
    </div>
  );
};

export default UserFeatures;
