import { Button } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import tenantConfig from '../../../../../../tenant.config';
import { useTranslation } from 'next-i18next';
import myProfilestyle from '../../styles/MyProfile.module.scss';

const config = tenantConfig();

const SharePlatforms = ({ setShowSocialButton, userprofile }) => {
  const { t, ready } = useTranslation(['donate']);
  const linkToShare = `${config.tenantURL}/t/${userprofile?.slug}`;
  const textToShare = ready
    ? t('donate:textToShare', { name: userprofile?.displayName })
    : '';
  const textToShareLinkedin = ready
    ? t('donate:textToShareLinkedin', { name: userprofile?.displayName })
    : '';
  const handleShare = (shareUrl) => {
    window.open(shareUrl, '_blank');
  };
  return (
    <div className={myProfilestyle.socialPlatformOptionConatiner}>
      <Button
        variant="outlined"
        startIcon={<CloseIcon />}
        onClick={() => setShowSocialButton(false)}
      />

      <TwitterIcon
        sx={{ color: '#68B030', cursor: 'pointer' }}
        onClick={() =>
          handleShare(
            `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
          )
        }
      />

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
