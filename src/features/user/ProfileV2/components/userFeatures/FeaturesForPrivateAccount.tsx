import { Button } from '@mui/material';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
  ShareSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { useRouter } from 'next/router';
import RedeemModal from './RedeemModal';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import SharePlatforms from './SharePlatfroms';
import { ReactElement } from 'react';
import { UserFeaturesProps } from '../../../../common/types/profile';

const FeaturesForPrivateAccount = ({
  handleShare,
  userprofile,
  showSocialButton,
  setShowSocialButton,
}: UserFeaturesProps): ReactElement => {
  const { t } = useTranslation(['me']);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const router = useRouter();

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
    <div className={myProfilestyle.buttonContainer}>
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
      {showSocialButton ? (
        <SharePlatforms
          setShowSocialButton={setShowSocialButton}
          userprofile={userprofile}
        />
      ) : (
        <Button
          variant="contained"
          startIcon={<ShareSvg color={'#FFFFFF'} />}
          onClick={handleShare}
        >
          {showSocialButton ? '' : t('me:share')}
        </Button>
      )}
    </div>
  );
};

export default FeaturesForPrivateAccount;
