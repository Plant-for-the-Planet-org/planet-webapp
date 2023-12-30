import SharePlatforms from './SharePlatforms';
import { Button } from '@mui/material';
import { ShareSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import { useTranslation } from 'next-i18next';
import { UserFeaturesProps } from '../../../../common/types/profile';
import theme from '../../../../../theme/themeProperties';

const Share = ({
  showSocialButton,
  setShowSocialButton,
  userProfile,
  handleShare,
}: UserFeaturesProps) => {
  const { light } = theme;
  const { t } = useTranslation(['me']);
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
        >
          {showSocialButton ? '' : t('me:share')}
        </Button>
      )}
    </>
  );
};

export default Share;
