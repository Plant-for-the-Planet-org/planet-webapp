import myProfileStyle from '../../../styles/MyProfile.module.scss';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import Share from './Share';
import { UserFeaturesProps } from '../../../../../common/types/profile';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import RedeemModal from './RedeemModal';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
} from '../../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../../theme/themeProperties';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';
import { PublicProfileFeature } from './PublicProfileFeature';

const UserFeatures = ({
  handleShare,
  userProfile,
  showSocialButton,
  setShowSocialButton,
}: UserFeaturesProps) => {
  const { light } = theme;
  const router = useRouter();
  const { t } = useTranslation(['profile']);
  const { setRefetchUserData } = useUserProps();
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const handleRegisterTree = () => {
    setRefetchUserData(false);
    router.push('/profile/register-trees');
  };

  const handleRedeemModalOpen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };
  return (
    <div className={myProfileStyle.buttonContainer}>
      {router.asPath !== '/profile' && !userProfile.isPrivate && (
        <div className={myProfileStyle.publicProfileContainer}>
          <PublicProfileFeature profile={userProfile} />
        </div>
      )}
      <div className={myProfileStyle.privateFeatureContainer}>
        {router.asPath === '/profile' && userProfile?.supportPin && (
          <>
            <Button
              className={myProfileStyle.profileRedeemButton}
              variant="contained"
              startIcon={<RedeemCodeSvg color={`${light.light}`} />}
              onClick={handleRedeemModalOpen}
            >
              {t('profile:feature.redeem')}
            </Button>
            <RedeemModal
              redeemModalOpen={isRedeemModalOpen}
              handleRedeemModalClose={handleRedeemModalClose}
            />
            <Button
              className={myProfileStyle.registeredTreeButton}
              variant="contained"
              startIcon={<RegisteredTreeSvg color={`${light.light}`} />}
              onClick={handleRegisterTree}
            >
              {t('profile:feature.registerTree')}
            </Button>
          </>
        )}
      </div>

      <div className={myProfileStyle.shareButtonContainer}>
        <Share
          handleShare={handleShare}
          userProfile={userProfile}
          showSocialButton={showSocialButton}
          setShowSocialButton={setShowSocialButton}
        />
      </div>
    </div>
  );
};

export default UserFeatures;
