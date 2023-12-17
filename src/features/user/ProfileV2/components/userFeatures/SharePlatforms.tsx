import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import tenantConfig from '../../../../../../tenant.config';
import { useTranslation } from 'next-i18next';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { ReactElement } from 'react';
import { SetState } from '../../../../common/types/common';
import { User, UserPublicProfile } from '@planet-sdk/common';
import theme from '../../../../../theme/themeProperties';

const config = tenantConfig();

export interface SharePlatformsProps {
  setShowSocialButton: SetState<boolean>;
  userProfile: User | UserPublicProfile;
}

const SharePlatforms = ({
  setShowSocialButton,
  userProfile,
}: SharePlatformsProps): ReactElement => {
  const { darkOliveGreen } = theme;
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

  const IconStyle = {
    color: `${darkOliveGreen}`,
    cursor: 'pointer',
    height: '32px',
    width: '32px',
  };

  return (
    <div className={myProfilestyle.socialPlatformOptionConatiner}>
      <Button
        variant="outlined"
        startIcon={<CloseIcon sx={{ marginLeft: '12px' }} />}
        onClick={() => setShowSocialButton(false)}
      />

      <div className={myProfilestyle.Xicon}>
        <img
          width="38px"
          height="38px"
          src="/assets/images/x_icon_green_bg.svg"
          onClick={() =>
            handleShare(
              `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
            )
          }
        />
      </div>

      <FacebookIcon
        sx={IconStyle}
        onClick={() =>
          handleShare(
            `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShareLinkedin}&hashtag=%23StopTalkingStartPlanting`
          )
        }
      />
      <LinkedInIcon
        sx={IconStyle}
        onClick={() =>
          handleShare(
            `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`
          )
        }
      />
    </div>
  );
};

export default SharePlatforms;
