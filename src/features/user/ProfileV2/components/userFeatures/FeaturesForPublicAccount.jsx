import { useTranslation } from 'next-i18next';
import { Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {
  SupportSvg,
  ShareSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { useRouter } from 'next/router';
import tenantConfig from '../../../../../../tenant.config';
import SharePlatforms from './SharePlatfroms';

const config = tenantConfig();

const FeaturesForPublicAccount = ({
  handleShare,
  userprofile,
  showSocialButton,
  setShowSocialButton,
}) => {
  const { t } = useTranslation(['me']);
  const router = useRouter();

  const handleSupport = () => {
    router.push(`/s/${userprofile.slug}`);
  };

  const handleShareOnLinkedIn = () => {
    if (config && userprofile) {
      const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`;
      window.open(shareUrl, '_blank');
    }
  };
  return (
    <div className={myProfilestyle.buttonContainer}>
      {userprofile?.type !== 'tpo' && (
        <Button
          variant="contained"
          startIcon={<SupportSvg />}
          onClick={handleSupport}
        >
          {t('me:support')}
        </Button>
      )}

      <Button
        variant="contained"
        startIcon={<LinkedInIcon />}
        onClick={handleShareOnLinkedIn}
      >
        {t('me:linkedIn')}
      </Button>

      {showSocialButton ? (
        <SharePlatforms
          setShowSocialButton={setShowSocialButton}
          userprofile={userprofile}
        />
      ) : (
        <Button
          variant="contained"
          startIcon={<ShareSvg />}
          onClick={handleShare}
        >
          {showSocialButton ? '' : t('me:share')}
        </Button>
      )}
    </div>
  );
};

export default FeaturesForPublicAccount;
