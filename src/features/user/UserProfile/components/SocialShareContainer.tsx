import React from 'react';
import {motion} from 'framer-motion';
import styles from '../styles/UserInfo.module.scss';
import TwitterIcon from '../../../../../public/assets/images/icons/share/Twitter';
import FacebookIcon from '../../../../../public/assets/images/icons/share/Facebook';
import InstagramIcon from '../../../../../public/assets/images/icons/share/Instagram';
import LinkedIn from '../../../../../public/assets/images/icons/share/Linkedin';
import tenantConfig from '../../../../../tenant.config';
import i18next from '../../../../../i18n';

const config = tenantConfig();

const { useTranslation } = i18next;

export default function SocialShareContainer({userprofile, type}:any) {
  const { t, ready } = useTranslation(['donate', 'me']);
  const [currentHover, setCurrentHover] = React.useState(-1);
  const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
  const textToShare = ready ? t('donate:textToShare', { name: userprofile.displayName }) : '';
  const textToShareLinkedin = ready ? t('donate:textToShareLinkedin', { name: userprofile.displayName }) : '';

  const shareClicked = async (shareUrl) => {
    openWindowLinks(shareUrl);
  };
  const openWindowLinks = (shareUrl) => {
    window.open(shareUrl, '_blank');
  };
  return ready ? (
    // <motion.div
    // initial={false}
    // animate={}
    <div className={styles.shareBtnContainer} 
    style={{display: type === 'private' ? 'flex' : null, justifyContent: type === 'private' ? 'space-evenly' : null}}>
      <div
        className={styles.shareIcon}
          onClick={() => shareClicked(
            `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShareLinkedin}&hashtag=%23StopTalkingStartPlanting`,
            '_blank',
          )}
        onMouseOver={() => setCurrentHover(1)}
        onTouchMove={() => setCurrentHover(1)}
        style={{padding: type === 'private' ? '10px' : null}}
      >
        <div className={type === 'private' ? styles.shareIconFacebookContainerPrivate : styles.shareIconFacebookContainer}>
          <FacebookIcon color={currentHover === 1 ? '#fff' : '#fff'} />
        </div>
      </div>
      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(2)}
        onClick={() =>
          shareClicked(`https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`)
        }
        onTouchMove={() => setCurrentHover(2)}
        style={{padding: type === 'private' ? '10px' : null}}
      >
        <div className={type === 'private' ? styles.shareIconFacebookContainerPrivate : styles.shareIconInstagramContainer}>
          <LinkedIn color={currentHover === 2 ? '#fff' : '#fff'} />
        </div>
      </div>
      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(3)}
        onTouchMove={() => setCurrentHover(3)}
          onClick={() => shareClicked(
            `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=PftP_int&url=${linkToShare}&text=${textToShare}`,
          )}
          style={{padding: type === 'private' ? '10px' : null}}
      >
        <div className={type === 'private' ? styles.shareIconFacebookContainerPrivate : styles.shareIconTwitterContainer}>
          <TwitterIcon color={currentHover === 3 ? '#fff' : '#fff'} />
        </div>
      </div>
    </div>
  ) : null;
}
