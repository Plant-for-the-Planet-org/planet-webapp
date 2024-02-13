import SharePlatforms from './SharePlatforms';
import { Button } from '@mui/material';
import { ShareSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import { useTranslation } from 'next-i18next';
import { UserFeaturesProps } from '../../../../common/types/profile';
import theme from '../../../../../theme/themeProperties';
import myProfileStyle from '../../styles/MyProfile.module.scss';
const Share = ({
  showSocialButton,
  setShowSocialButton,
  userProfile,
  handleShare,
}: UserFeaturesProps) => {
  const { light } = theme;
  const { t } = useTranslation(['profile']);
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
          {showSocialButton ? '' : t('profile:feature.share')}
        </Button>
      )}
    </>
  );
};

export default Share;
