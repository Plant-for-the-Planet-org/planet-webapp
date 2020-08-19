import React from 'react';
import Redeem from '../../../../assets/images/icons/userProfileIcons/Redeem';
import Share from '../../../../assets/images/icons/userProfileIcons/Share';
import Shovel from '../../../../assets/images/icons/userProfileIcons/Shovel';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../UserProfile.module.scss';

export default function UserProfileOptions({ userprofile }: any) {
  return (
    <Row className={styles.bottomIconsRow}>
      <Col className={styles.iconTextColumn}>
        <div className={styles.bottomIconBg}>
          <Redeem color="white" />
        </div>
        <p className={styles.bottomRowText}> Redeem</p>
      </Col>

      <Col className={styles.iconTextColumn}>
        <div className={styles.bottomIconBg}>
          <Shovel color="white" />
        </div>

        <p className={styles.bottomRowText}> Register Trees</p>
      </Col>

      <Col className={styles.iconTextColumn}>
        <div className={styles.bottomIconBg}>
          <Share color="white" />
        </div>
        <p className={styles.bottomRowText}> Share </p>
      </Col>
    </Row>
  );
}
