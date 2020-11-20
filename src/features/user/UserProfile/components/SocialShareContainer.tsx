import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TwitterIcon from '../../../../../public/assets/images/icons/share/Twitter';
import FacebookIcon from '../../../../../public/assets/images/icons/share/Facebook';
import InstagramIcon from '../../../../../public/assets/images/icons/share/Instagram';
import tenantConfig from '../../../../../tenant.config';
import i18next from '../../../../../i18n';

const config = tenantConfig()
export default function SocialShareContainer({userprofile}:any) {
    const { useTranslation } = i18next;
    const { t } = useTranslation(['donate', 'me']);
  const [currentHover, setCurrentHover] = React.useState(-1);
  const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
  const textToShare = t('donate:textToShare', { name: userprofile.displayName });

  const shareClicked = async (shareUrl) => {
    openWindowLinks(shareUrl);
  };
  const openWindowLinks = (shareUrl) => {
    window.open(shareUrl, '_blank');
  };
  return (
    <div className={styles.shareBtnContainer}>
      <div
        className={styles.shareIcon}
          onClick={() => shareClicked(
            `https://www.facebook.com/sharer.php?u=${config.tenantURL}&quote=${textToShare}`,
            '_blank',
          )}
        onMouseOver={() => setCurrentHover(1)}
        onTouchMove={() => setCurrentHover(1)}
      >
        <div className={styles.shareIconFacebookContainer}>
          <FacebookIcon color={currentHover === 1 ? '#fff' : '#fff'} />
        </div>
      </div>
      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(2)}
        onClick={() =>
          shareClicked('https://www.instagram.com/plantfortheplanet_official/')
        }
        onTouchMove={() => setCurrentHover(2)}
      >
        <div className={styles.shareIconInstagramContainer}>
          <InstagramIcon color={currentHover === 2 ? '#fff' : '#fff'} />
        </div>
      </div>
      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(3)}
        onTouchMove={() => setCurrentHover(3)}
          onClick={() => shareClicked(
            `https://twitter.com/intent/tweet?text=${textToShare}`,
          )}
      >
        <div className={styles.shareIconTwitterContainer}>
          <TwitterIcon color={currentHover === 3 ? '#fff' : '#fff'} />
        </div>
      </div>
    </div>
  );
}
