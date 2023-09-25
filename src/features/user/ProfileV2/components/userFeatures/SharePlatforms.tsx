import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import tenantConfig from '../../../../../../tenant.config';
import { useTranslation } from 'next-i18next';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { ReactElement } from 'react';
import { SetState } from '../../../../common/types/common';
import { User } from '@planet-sdk/common';
import { PublicUser } from '../../../../common/types/user';

const config = tenantConfig();

export interface SharePlatformsProps {
  setShowSocialButton: SetState<boolean>;
  userProfile: User | PublicUser;
}

const SharePlatforms = ({
  setShowSocialButton,
  userProfile,
}: SharePlatformsProps): ReactElement => {
  const { t, ready } = useTranslation(['donate']);
  const linkToShare = `${config.tenantURL}/t/${userProfile?.slug}`;
  const textToShare = ready
    ? t('donate:textToShare', { name: userProfile?.displayName })
    : '';
  const textToShareLinkedin = ready
    ? t('donate:textToShareLinkedin', { name: userProfile?.displayName })
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
      {userProfile?.isPrivate && (
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
