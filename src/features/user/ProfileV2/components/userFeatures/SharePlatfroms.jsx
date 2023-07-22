import { Button } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import tenantConfig from '../../../../../../tenant.config';
import { useTranslation } from 'next-i18next';

const config = tenantConfig();

const SharePlatforms = ({ setShowSocialButton, userprofile }) => {
  console.log(userprofile?.isPrivate, '==');
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
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        variant="outlined"
        startIcon={<CloseIcon />}
        onClick={() => setShowSocialButton(false)}
      />
      <div>
        <TwitterIcon
          sx={{ color: '#68B030', cursor: 'pointer' }}
          onClick={() =>
            handleShare(
              `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
            )
          }
        />
      </div>
      <div>
        <FacebookIcon
          sx={{ color: '#68B030', cursor: 'pointer' }}
          onClick={() =>
            handleShare(
              `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShareLinkedin}&hashtag=%23StopTalkingStartPlanting`
            )
          }
        />
      </div>
      {userprofile?.isPrivate && (
        <div>
          <LinkedInIcon
            sx={{ color: '#68B030', cursor: 'pointer' }}
            onClick={() =>
              handleShare(
                `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default SharePlatforms;
