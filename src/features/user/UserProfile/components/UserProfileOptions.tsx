import React from 'react';
import Redeem from '../../../../../public/assets/images/icons/userProfileIcons/Redeem';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Shovel from '../../../../../public/assets/images/icons/userProfileIcons/Shovel';
import styles from '../styles/UserInfo.module.scss';
import RedeemModal from './RedeemModal';
import { isMobileBrowser } from '../../../../utils/isMobileBrowser';

import { makeStyles, Theme } from '@material-ui/core/styles';

export default function UserProfileOptions({ 
  userprofile,
  handleTextCopiedSnackbarOpen
 }: any) {

  const webShareMobile = async() => {
      try {
        const response = await navigator.share({
          title:'Check out Plant-for-the-Planet!',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
        })
        console.log('Share complete', response)
      } catch (error) {
        console.error('Could not share at this time', error);
      }
  }
  
  const onShareClicked = () => {
    if(navigator.share) {
      // if in phone and web share API supported
      webShareMobile();
    } else {
      // in desktop
      navigator.clipboard.writeText('Dummy text copied to clipboard!');
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

  return (
      <div className={styles.bottomIconsRow}>
        <div className={styles.iconTextColumn}>
          <div className={styles.bottomIconBg} onClick={handleRedeemModalOpen}>
            <Redeem color="white" />
          </div>
          <p className={styles.bottomRowText}> Redeem</p>
        </div>

        <RedeemModal
          redeemModalOpen={redeemModalOpen}
          handleRedeemModalClose={handleRedeemModalClose}
        />

        <div className={styles.iconTextColumn}>
          <div className={styles.bottomIconBg}>
            <Shovel color="white" />
          </div>

          <p className={styles.bottomRowText}> Register Trees</p>
        </div>

        <div className={styles.iconTextColumn} onClick={onShareClicked}>
          <div className={styles.bottomIconBg}>
            <Share color="white" />
          </div>
          <p className={styles.bottomRowText}> Share </p>
        </div>
      </div>
  );
}
