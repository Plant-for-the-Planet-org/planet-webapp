import React from 'react';
import Redeem from '../../../../assets/images/icons/userProfileIcons/Redeem';
import Share from '../../../../assets/images/icons/userProfileIcons/Share';
import Shovel from '../../../../assets/images/icons/userProfileIcons/Shovel';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/UserInfo.module.scss';
import RedeemModal from './RedeemModal';
import { isMobileBrowser } from '../../../../utils/isMobileBrowser';

import { makeStyles, Theme } from '@material-ui/core/styles';

export default function UserProfileOptions({ 
  userprofile,
  handleTextCopiedSnackbarOpen
 }: any) {

  
  const onShareClicked = () => {
    if (!isMobileBrowser()) {
      // desktop browser
      navigator.clipboard.writeText('Dummy text copied to clipboard!');
      handleTextCopiedSnackbarOpen();
    } else {
      // mobile browser
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
      <Row className={styles.bottomIconsRow}>
        <Col className={styles.iconTextColumn}>
          <div className={styles.bottomIconBg} onClick={handleRedeemModalOpen}>
            <Redeem color="white" />
          </div>
          <p className={styles.bottomRowText}> Redeem</p>
        </Col>

        <RedeemModal
          redeemModalOpen={redeemModalOpen}
          handleRedeemModalClose={handleRedeemModalClose}
        />

        <Col className={styles.iconTextColumn}>
          <div className={styles.bottomIconBg}>
            <Shovel color="white" />
          </div>

          <p className={styles.bottomRowText}> Register Trees</p>
        </Col>

        <Col className={styles.iconTextColumn} onClick={onShareClicked}>
          <div className={styles.bottomIconBg}>
            <Share color="white" />
          </div>
          <p className={styles.bottomRowText}> Share </p>
        </Col>
      </Row>
  );
}
