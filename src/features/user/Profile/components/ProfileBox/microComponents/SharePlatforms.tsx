import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import { useTenant } from '../../../../../common/Layout/TenantContext';
import { useTranslations } from 'next-intl';
import myProfilestyle from '../../../styles/MyProfile.module.scss';
import { ReactElement } from 'react';
import { SetState } from '../../../../../common/types/common';
import { User, UserPublicProfile } from '@planet-sdk/common';
import theme from '../../../../../../theme/themeProperties';
import XImage from '../../../../../../public/assets/images/X.svg';
import { X } from '../../../../../../../public/assets/images/ProfilePageIcons';

export interface SharePlatformsProps {
  setShowSocialButton: SetState<boolean>;
  userProfile: User | UserPublicProfile;
}

const SharePlatforms = ({
  setShowSocialButton,
  userProfile,
}: SharePlatformsProps): ReactElement => {
  const { tenantConfig } = useTenant();
  const { darkOliveGreen } = theme;
  const t = useTranslations('Donate');
  const linkToShare = `${tenantConfig.config.tenantURL}/t/${userProfile?.slug}`;
  const textToShare = t('textToShare', { name: userProfile?.displayName });
  const textToShareLinkedin = t('textToShareLinkedin', {
    name: userProfile?.displayName,
  });

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
        sx={{
          padding: '7px 30px',
        }}
      />

      <div className={myProfilestyle.Xicon}>
        <button
          type="button"
          onClick={() =>
            handleShare(
              `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&url=${linkToShare}&text=${textToShare}`
            )
          }
        >
          <X height="38px" width="38px" />
        </button>
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
