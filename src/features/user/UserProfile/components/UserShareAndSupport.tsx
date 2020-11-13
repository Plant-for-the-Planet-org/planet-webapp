import React from 'react';
import { useRouter } from 'next/router';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Support from '../../../../../public/assets/images/icons/userProfileIcons/Support';
import styles from '../styles/UserInfo.module.scss';
import tenantConfig from '../../../../../tenant.config';
import TwitterIcon from '../../../../../public/assets/images/icons/share/Twitter';
import FacebookIcon from '../../../../../public/assets/images/icons/share/Facebook';
import InstagramIcon from '../../../../../public/assets/images/icons/share/Instagram';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import i18next from '../../../../../i18n';

const config = tenantConfig();
export default function UserShareAndSupport({ userprofile }: any) {
  const { useTranslation } = i18next;
  const { t } = useTranslation(['donate', 'me']);
  const router = useRouter();
  const [currentHover, setCurrentHover] = React.useState(-1);
  const [showSocialBtn, setShowSocialBtn] = React.useState(false);
  const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
  const textToShare = t('donate:textToShare', { linkToShare });

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: userprofile.slug,
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
      console.log('not supported');
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
        <div className={styles.shareBtnContainer}>
          <div
            className={styles.shareIconFacebook}
            onClick={() =>
              shareClicked(
                `https://www.facebook.com/sharer.php?u=${config.tenantURL}&quote=${textToShare}`,
                '_blank'
              )
            }
            onMouseOver={() => setCurrentHover(1)}
            onTouchMove={() => setCurrentHover(1)}
          >
            <FacebookIcon color={currentHover === 1 ? '#3b5998' : '#f2f2f7'} />
          </div>
          <div
            className={styles.shareIconInstagram}
            onMouseOver={() => setCurrentHover(2)}
            onClick={() =>
              shareClicked(
                'https://www.instagram.com/plantfortheplanet_official/'
              )
            }
            onTouchMove={() => setCurrentHover(2)}
          >
            <InstagramIcon color={currentHover === 2 ? '#dd217b' : '#f2f2f7'} />
          </div>
          <div
            className={styles.shareIconTwitter}
            onMouseOver={() => setCurrentHover(3)}
            onTouchMove={() => setCurrentHover(3)}
            onClick={() =>
              shareClicked(
                `https://twitter.com/intent/tweet?text=${textToShare}`
              )
            }
          >
            <TwitterIcon color={currentHover === 3 ? '#00acee' : '#f2f2f7'} />
          </div>
        </div>
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
