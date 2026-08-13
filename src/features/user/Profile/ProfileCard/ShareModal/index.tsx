import type { ProfileV2Props } from '../../../../common/types/profile';

import { useContext } from 'react';
import styles from './ShareModal.module.scss';
import { Modal, Fade, TextField } from '@mui/material';
import { ThemeContext } from '../../../../../theme/themeContext';
import CopyToClipboard from '../../../../common/CopyToClipboard';
import IconButton from '../../../../common/IconButton';
import {
  FacebookCustomIcon,
  LinkedInCustomIcon,
  MailCustomIcon,
  WhatsappCustomIcon,
  XCustomIcon,
} from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { useTranslations } from 'next-intl';
import { useTenantStore } from '../../../../../stores/tenantStore';

const CustomCopyButton = () => {
  const t = useTranslations('Profile');
  return (
    <button type="button" className={styles.copyButton}>
      <span>{t('shareFeature.copyLink')}</span>
    </button>
  );
};

interface ShareModalProps {
  shareModalOpen: boolean;
  handleShareModalClose: () => void;
  userProfile: ProfileV2Props['userProfile'];
}

const ShareModal = ({
  shareModalOpen,
  handleShareModalClose,
  userProfile,
}: ShareModalProps) => {
  const { theme } = useContext(ThemeContext);
  const t = useTranslations('Profile');
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  const linkToShare = `${tenantConfig.config.tenantURL}/t/${userProfile?.slug}`;
  const textToShare = t('shareFeature.textToShare', {
    name: userProfile?.displayName,
  });
  const textToShareLinkedin = t('shareFeature.textToShareLinkedin', {
    name: userProfile?.displayName,
  });
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank');
  };

  const handleMailShare = () => {
    const subject = t('shareFeature.shareTextTitle');
    const body = encodeURIComponent(
      `${t('shareFeature.textToShare', {
        name: userProfile?.displayName,
      })}\n\n${linkToShare}`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    window.open(mailtoLink);
  };

  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={shareModalOpen}
      onClose={handleShareModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <Fade in={shareModalOpen}>
        <div className={styles.shareModalPopup}>
          <div className={styles.socialMediaIconContainer}>
            <h3>{t('shareFeature.shareVia')}</h3>
            <div>
              <IconButton
                label={t('shareFeature.shareOn', {
                  socialMedia: 'Facebook',
                })}
                onClick={() =>
                  handleShare(
                    `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShareLinkedin}&hashtag=%23StopTalkingStartPlanting`
                  )
                }
                className={styles.socialMediaIcon}
              >
                <FacebookCustomIcon />
              </IconButton>
              <IconButton
                label={t('shareFeature.shareOn', {
                  socialMedia: 'LinkedIn',
                })}
                onClick={() =>
                  handleShare(
                    `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`
                  )
                }
                className={styles.socialMediaIcon}
              >
                <LinkedInCustomIcon />
              </IconButton>

              <IconButton
                label={t('shareFeature.shareOn', {
                  socialMedia: 'WhatsApp',
                })}
                onClick={() =>
                  handleShare(`whatsapp://send?text=${linkToShare}`)
                }
                className={styles.socialMediaIcon}
              >
                <WhatsappCustomIcon />
              </IconButton>

              <IconButton
                label={t('shareFeature.shareOn', { socialMedia: 'X' })}
                onClick={() =>
                  handleShare(
                    `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
                  )
                }
                className={styles.socialMediaIcon}
              >
                <XCustomIcon />
              </IconButton>
              <IconButton
                label={t('shareFeature.shareViaEmail')}
                onClick={handleMailShare}
                className={styles.socialMediaIcon}
              >
                <MailCustomIcon />
              </IconButton>
            </div>
          </div>
          <div className={styles.shareLinkContainer}>
            <TextField
              id="share-profile-link"
              name="share-profile-link"
              InputProps={{
                readOnly: true,
              }}
              value={linkToShare}
            />
            <CopyToClipboard
              isButton={false}
              text={linkToShare}
              customCopyButton={<CustomCopyButton />}
            />
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ShareModal;
