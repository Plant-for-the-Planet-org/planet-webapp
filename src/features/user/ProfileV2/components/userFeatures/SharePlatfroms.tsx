import { Button } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import tenantConfig from '../../../../../../tenant.config';
import { useTranslation } from 'next-i18next';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { ReactElement } from 'react';
import { SharePlatformsProps } from '../../../../common/types/profile';

const config = tenantConfig();

const SharePlatforms = ({
  setShowSocialButton,
  userprofile,
}: SharePlatformsProps): ReactElement => {
  const { t, ready } = useTranslation(['donate']);
  const linkToShare = `${config.tenantURL}/t/${userprofile?.slug}`;
  const textToShare = ready
    ? t('donate:textToShare', { name: userprofile?.displayName })
    : '';
  const textToShareLinkedin = ready
    ? t('donate:textToShareLinkedin', { name: userprofile?.displayName })
    : '';
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank');
  };
  return (
    <div className={myProfilestyle.socialPlatformOptionConatiner}>
      <Button
        variant="outlined"
        startIcon={<CloseIcon sx={{ marginLeft: '12px' }} />}
        onClick={() => setShowSocialButton(false)}
      />

      <IconButton
        sx={{ cursor: 'pointer' }}
        onClick={() =>
          handleShare(
            `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
          )
        }
      >
        <img
          width="50px"
          height="50px"
          src="/assets/images/x_icon_green_bg.svg"
        />
      </IconButton>

      <FacebookIcon
        sx={{ color: '#68B030', cursor: 'pointer' }}
        onClick={() =>
          handleShare(
            `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShareLinkedin}&hashtag=%23StopTalkingStartPlanting`
          )
        }
      />
      {userprofile?.isPrivate && (
        <LinkedInIcon
          sx={{ color: '#68B030', cursor: 'pointer' }}
          onClick={() =>
            handleShare(
              `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`
            )
          }
        />
      )}
    </div>
  );
};

export default SharePlatforms;
