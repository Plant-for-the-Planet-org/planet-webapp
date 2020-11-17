import React from 'react';
import Redeem from '../../../../../public/assets/images/icons/userProfileIcons/Redeem';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Shovel from '../../../../../public/assets/images/icons/userProfileIcons/Shovel';
import styles from '../styles/UserInfo.module.scss';
import RedeemModal from './RedeemModal';
import i18next from '../../../../../i18n'
import tenantConfig from '../../../../../tenant.config';

import { makeStyles, Theme } from '@material-ui/core/styles';

const config = tenantConfig();

const {useTranslation} = i18next;
export default function UserProfileOptions({ 
  userprofile,
  handleTextCopiedSnackbarOpen
 }: any) {

  const {t} = useTranslation(['me']);
  const linkToShare = `${config.tenantURL}/t/${userprofile.slug}`;
  const textToShare = t('donate:textToShare', { linkToShare });
  const webShareMobile = async() => {
      try {
        const response = await navigator.share({
          title: userprofile.slug,
          url: window.location.href,
          text: textToShare,
        })
      } catch (error) {
        // console.error('Could not share at this time', error);
      }
  }
  
  const onShareClicked = () => {
    if(navigator.share) {
      // if in phone and web share API supported
      webShareMobile();
    } else {
      // in desktop
      navigator.clipboard.writeText(window.location.href);
      handleTextCopiedSnackbarOpen();
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
console.log(userprofile);
  return (
      <div className={styles.bottomIconsRow}>
        <div className={styles.iconTextColumn}>
          <div className={styles.bottomIconBg} onClick={handleRedeemModalOpen}>
            <Redeem color="white" />
          </div>
        <p className={styles.bottomRowText}> {t('me:redeem')}</p>
        </div>

        <RedeemModal
          redeemModalOpen={redeemModalOpen}
          handleRedeemModalClose={handleRedeemModalClose}
        />

        <div className={styles.iconTextColumn}>
          <div className={styles.bottomIconBg}>
            <Shovel color="white" />
          </div>

        <p className={styles.bottomRowText}> {t('me:registerTrees')}</p>
        </div>

        <div className={styles.iconTextColumn} onClick={onShareClicked}>
          <div className={styles.bottomIconBg}>
            <Share color="white" />
          </div>
          <p className={styles.bottomRowText}> {t('me:share')} </p>
        </div>
      </div>
  );
}
