import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import Redeem from '../../../../../public/assets/images/icons/userProfileIcons/Redeem';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Shovel from '../../../../../public/assets/images/icons/userProfileIcons/Shovel';
import tenantConfig from '../../../../../tenant.config';
import styles from '../styles/Profile.module.scss';
import RedeemModal from './RedeemModal';
import SocialShareContainer from './SocialShareContainer';
import { useTranslation } from 'next-i18next';

const config = tenantConfig();

const socialIconAnimate = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      stiffness: 150,
      type: 'spring',
    },
  },
  closed: {
    y: -100,
    opacity: 0,
    rotateX: -15,
    transition: {
      delay: 0.8,
      duration: 0.3,
    },
  },
  init: {
    x: -100,
    opacity: 0,
  },
  // }
};

export default function UserProfileOptions({ userprofile }: any) {
  const router = useRouter();
  const { t, ready } = useTranslation(['me']);
  const webShareData = {
    title: ready ? t('donate:shareTextTitle') : '',
    url: `${process.env.SCHEME}://${config.tenantURL}/t/${userprofile.slug}`,
    text: ready
      ? t('donate:textToShare', { name: userprofile.displayName })
      : '',
  };
  const [showSocialBtn, setShowSocialBtn] = React.useState(false);
  const [screenWidth, setScreenWidth] = React.useState<number | null>(null);
  const [divWidth, setDivWidth] = React.useState<number | null>(null);
  const elementRef = React.useRef(null);

  const webShareMobile = async () => {
    try {
      await navigator.share(webShareData);
    } catch (error) {
      // console.error('Could not share at this time', error);
    }
  };
  React.useEffect(() => {
    if (ready) {
      setScreenWidth(window.screen.width);
      setDivWidth(elementRef.current.getBoundingClientRect().width);
    }
  });
  const onShareClicked = () => {
    if (navigator?.canShare && navigator.canShare(webShareData)) {
      // if in phone and web share API supported
      webShareMobile();
    } else {
      setShowSocialBtn(!showSocialBtn);
      // in desktop
      // navigator.clipboard.writeText(window.location.href);
      // handleTextCopiedSnackbarOpen();
    }
  };

  // redeem modal
  const [redeemModalOpen, setRedeemModalOpen] = React.useState(false);
  const handleRedeemModalClose = () => {
    setRedeemModalOpen(false);
  };
  const handleRedeemModalOpen = () => {
    setRedeemModalOpen(true);
  };

  return ready ? (
    <div style={{ position: 'relative' }}>
      {showSocialBtn && screenWidth !== null && screenWidth < 600 && (
        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            paddingLeft: '118px',
          }}
          transition={{ delay: 0.2, stiffness: 150, type: 'spring' }}
        >
          <SocialShareContainer userprofile={userprofile} />
        </motion.div>
      )}
      <div className={styles.bottomIconsRow} ref={elementRef}>
        <div className={styles.iconTextColumn}>
          <button
            id={'userProHandleRedeem'}
            className={styles.bottomIconBg}
            onClick={handleRedeemModalOpen}
          >
            <Redeem color="white" />
          </button>
          <p className={styles.bottomRowText}> {t('me:redeem')}</p>
        </div>

        <RedeemModal
          redeemModalOpen={redeemModalOpen}
          handleRedeemModalClose={handleRedeemModalClose}
          userprofile={userprofile}
        />

        <button
          id={'userProBottomIcon'}
          className={styles.iconTextColumn}
          onClick={() => router.push('/profile/register-trees')}
        >
          <div className={styles.bottomIconBg}>
            <Shovel color="white" />
          </div>

          <p className={styles.bottomRowText}> {t('me:registerTrees')}</p>
        </button>

        <div className={styles.iconTextColumn} onClick={onShareClicked}>
          <div className={styles.bottomIconBg}>
            {showSocialBtn ? (
              <CancelIcon color="white" width="25px" />
            ) : (
              <Share color="white" />
            )}
          </div>
          {showSocialBtn ? (
            <p className={styles.bottomRowText}>{t('me:close')}</p>
          ) : (
            <p className={styles.bottomRowText}> {t('me:share')} </p>
          )}
        </div>
      </div>
      {showSocialBtn && screenWidth !== null && screenWidth > 600 && (
        <motion.div
          animate={{
            position: 'absolute',
            top: '35px',
            right: divWidth && divWidth > 320 ? '290px' : '-180px',
          }}
        >
          <motion.div
            initial="init"
            animate={showSocialBtn ? 'open' : 'closed'}
            // transition={{delay: 0.2, stiffness: 150, type:"spring"}}
            variants={socialIconAnimate}
          >
            <SocialShareContainer userprofile={userprofile} type="private" />
          </motion.div>
        </motion.div>
      )}
    </div>
  ) : null;
}
