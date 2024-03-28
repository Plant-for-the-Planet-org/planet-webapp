import SharePlatforms from './SharePlatforms';
import { Button } from '@mui/material';
import { ShareSvg } from '../../../../../../../public/assets/images/ProfilePageIcons';
import { useTranslations } from 'next-intl';
import { UserFeaturesProps } from '../../../../../common/types/profile';
import theme from '../../../../../../theme/themeProperties';
import myProfileStyle from '../../../styles/MyProfile.module.scss';
const Share = ({
  showSocialButton,
  setShowSocialButton,
  userProfile,
  handleShare,
}: UserFeaturesProps) => {
  const { light } = theme;
  const t = useTranslations('Profile');
  return (
    <>
      {showSocialButton ? (
        <SharePlatforms
          setShowSocialButton={setShowSocialButton}
          userProfile={userProfile}
        />
      ) : (
        <Button
          variant="contained"
          startIcon={<ShareSvg color={`${light.light}`} />}
          onClick={handleShare}
          className={myProfileStyle.shareButton}
        >
          {showSocialButton ? '' : t('feature.share')}
        </Button>
      )}
    </>
  );
};

export default Share;
