import React from 'react';
import { useRouter } from 'next/router';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Support from '../../../../../public/assets/images/icons/userProfileIcons/Support';
import styles from '../styles/UserInfo.module.scss';
import tenantConfig from '../../../../../tenant.config';
// import TwitterIcon from '../../../../../public/assets/images/icons/share/Twitter';
// import FacebookIcon from '../../../../../public/assets/images/icons/share/Facebook';
// import InstagramIcon from '../../../../../public/assets/images/icons/share/Instagram';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import i18next from '../../../../../i18n';
import SocialShareContainer from './SocialShareContainer';
import { motion } from 'framer-motion';

const config = tenantConfig();

export default function UserShareAndSupport({ userprofile }: any) {
  const { useTranslation } = i18next;
  const { t } = useTranslation(['donate', 'me']);
  const router = useRouter();
  const [currentHover, setCurrentHover] = React.useState(-1);
  const [showSocialBtn, setShowSocialBtn] = React.useState(false);
  const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
  const textToShare = t('donate:textToShare', { name: userprofile.displayName });

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: t('donate:shareTextTitle'),
          url: window.location.href,
          text: textToShare,
        })
        .then(() => {
          console.log('thanks for sharing');
        })
        .catch(() => {
          console.log('error in sharing');
        });
    } else {
      setShowSocialBtn(true);
    }
  };
  const shareClicked = async (shareUrl) => {
    openWindowLinks(shareUrl);
  };
  const openWindowLinks = (shareUrl) => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div>
      {showSocialBtn && (
        <motion.div 
          animate={{
            paddingLeft: userprofile.type !== 'tpo' ? '191px' : null,
            y: 0,
            opacity: 1,
          }}
          transition={{stiffness: 150, type:"spring"}}
          initial={{
            y: 100,
            opacity: 0
          }}
        >
          <SocialShareContainer userprofile={userprofile} />
        </motion.div>
      )}
      <div className={styles.bottomIconsRow}>
        {userprofile.type !== 'tpo' && (
          <div
            className={styles.iconTextColumnSupport}
            onClick={() => {
              router.push(`/s/${userprofile.slug}`);
            }}
          >
            <div className={styles.bottomIconBgSupport}>
              <Support width="37px" paddingLeft="10px" />
              <p className={styles.bottomRowTextSupport}>{t('me:support')}</p>
            </div>
          </div>
        )}
        <div className={styles.iconTextColumnSupport}>
          {showSocialBtn ? (
            <div
              className={styles.bottomIconBgSupport}
              onClick={() => setShowSocialBtn(false)}
            >
              <CancelIcon color="white" width="25px" />
              <p className={styles.bottomRowTextSupport}>{t('me:close')}</p>
            </div>
          ) : (
            <div className={styles.bottomIconBgSupport} onClick={handleShare}>
              <Share width="39px" paddingLeft="10px" color="white" solid />
              <p className={styles.bottomRowTextSupport}>{t('me:share')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
