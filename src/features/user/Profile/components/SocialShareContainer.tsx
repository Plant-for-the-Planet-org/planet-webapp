import React from 'react';
import styles from '../styles/Profile.module.scss';
import TwitterIcon from '../../../../../public/assets/images/icons/share/Twitter';
import FacebookIcon from '../../../../../public/assets/images/icons/share/Facebook';
import LinkedIn from '../../../../../public/assets/images/icons/share/Linkedin';
import tenantConfig from '../../../../../tenant.config';
import { useTranslation } from 'next-i18next';
import { User, UserPublicProfile } from '@planet-sdk/common';

const config = tenantConfig();

interface Props {
  userprofile: User | UserPublicProfile;
  type?: string;
}

export default function SocialShareContainer({ userprofile, type }: Props) {
  const { t, ready } = useTranslation(['donate', 'me']);
  const [currentHover, setCurrentHover] = React.useState(-1);
  const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
  const textToShare = ready
    ? t('donate:textToShare', { name: userprofile.displayName })
    : '';
  const textToShareLinkedin = ready
    ? t('donate:textToShareLinkedin', { name: userprofile.displayName })
    : '';

  const openWindowLinks = (shareUrl: string) => {
    window.open(shareUrl, '_blank');
  };

  const shareClicked = async (shareUrl: string) => {
    openWindowLinks(shareUrl);
  };

  return ready ? (
    // <motion.div
    // initial={false}
    // animate={}
    <div
      className={styles.shareBtnContainer}
      style={{
        display: type === 'private' ? 'flex' : undefined,
        justifyContent: type === 'private' ? 'space-evenly' : undefined,
      }}
    >
      <div
        className={styles.shareIcon}
        onClick={() =>
          shareClicked(
            `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShareLinkedin}&hashtag=%23StopTalkingStartPlanting`
          )
        }
        onMouseOver={() => setCurrentHover(1)}
        onTouchMove={() => setCurrentHover(1)}
        style={{ padding: type === 'private' ? '10px' : undefined }}
      >
        <div
          className={
            type === 'private'
              ? styles.shareIconFacebookContainerPrivate
              : styles.shareIconFacebookContainer
          }
        >
          <FacebookIcon color={currentHover === 1 ? '#fff' : '#fff'} />
        </div>
      </div>
      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(2)}
        onClick={() =>
          shareClicked(
            `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`
          )
        }
        onTouchMove={() => setCurrentHover(2)}
        style={{ padding: type === 'private' ? '10px' : 0 }}
      >
        <div
          className={
            type === 'private'
              ? styles.shareIconFacebookContainerPrivate
              : styles.shareIconInstagramContainer
          }
        >
          <LinkedIn color={currentHover === 2 ? '#fff' : '#fff'} />
        </div>
      </div>
      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(3)}
        onTouchMove={() => setCurrentHover(3)}
        onClick={() =>
          shareClicked(
            `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
          )
        }
        style={{ padding: type === 'private' ? '10px' : 0 }}
      >
        <div
          className={
            type === 'private'
              ? styles.shareIconFacebookContainerPrivate
              : styles.shareIconTwitterContainer
          }
        >
          <TwitterIcon color={currentHover === 3 ? '#fff' : '#fff'} />
        </div>
      </div>
    </div>
  ) : null;
}
