import myProfileStyle from '../../styles/MyProfile.module.scss';
import { Button } from '@mui/material';
import { SupportSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useRouter } from 'next/router';
import Share from './Share';
import { UserFeaturesProps } from '../../../../common/types/profile';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import RedeemModal from './RedeemModal';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../theme/themeProperties';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { PublicProfileFeature } from '../MicroComponents/ProfileBox/PublicProfileFeature';

const UserFeatures = ({
  handleShare,
  userProfile,
  showSocialButton,
  setShowSocialButton,
}: UserFeaturesProps) => {
  const { tenantConfig } = useTenant();
  const { light } = theme;
  const router = useRouter();
  const { t } = useTranslation(['profile', 'me']);
  const { setRefetchData } = useUserProps();
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const handleRegisterTree = () => {
    setRefetchData(false);
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
        <PublicProfileFeature profile={userProfile} />
      )}

      {router.asPath === '/profile' && (
        <>
          <Button
            className={myProfileStyle.profileRedeemButton}
            variant="contained"
            startIcon={<RedeemCodeSvg color={`${light.light}`} />}
            onClick={handleRedeemModalOpen}
          >
            {t('profile:feature.redeem')}
          </Button>
          <Button
            className={myProfileStyle.registeredTreeButton}
            variant="contained"
            startIcon={<RegisteredTreeSvg color={`${light.light}`} />}
            onClick={handleRegisterTree}
          >
            {t('me:registerTree')}
          </Button>
        </>
      )}

      <RedeemModal
        redeemModalOpen={isRedeemModalOpen}
        handleRedeemModalClose={handleRedeemModalClose}
      />

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
