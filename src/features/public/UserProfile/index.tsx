import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LandingSection from '../../common/Layout/LandingSection';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import styles from './UserProfile.module.scss';
import Redeem from '../../../assets/images/icons/userProfileIcons/Redeem';
import Share from '../../../assets/images/icons/userProfileIcons/Share';
import Shovel from '../../../assets/images/icons/userProfileIcons/Shovel';
import Settings from '../../../assets/images/icons/userProfileIcons/Settings';
import ScrollDown from '../../../assets/images/icons/userProfileIcons/ScrollDown'

export default function UserProfile({ userprofile }: any) {
  // console.log(DownArrow)
  return (
    <main>
      {/* render only if it is ME page */}
      {userprofile.isMe && (
        <div className={styles.settingsIcon}>
          <Settings color="white" />
        </div>
      )}
      {userprofile.isMe && (
        <div className={styles.downIcon}>
          <ScrollDown color="white" />
        </div>
      )}
      <LandingSection>
        <div className={styles.landingContent}>
          <TreeCounter
            target={userprofile.countTarget}
            planted={userprofile.countPlanted}
          />

          <h2 className={styles.treeCounterName}>{userprofile.displayName}</h2>

          {/* will render only if it is ME page */}
          {userprofile.isMe && (
            <React.Fragment>
              <p className={styles.treeCounterDescription}>
                {userprofile.description}{' '}
              </p>

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
            </React.Fragment>
          )}
        </div>
      </LandingSection>
      <Container fluid="md">
        <Row className={styles.aboutSection}>
          <Col xs={12} md={6} className={styles.aboutSectionImages}></Col>
          <Col xs={12} md={6} className={styles.aboutSectionText}></Col>
        </Row>
      </Container>
    </main>
  );
}
