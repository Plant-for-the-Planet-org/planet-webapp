import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LandingSection from '../../common/Layout/LandingSection';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import styles from './UserProfile.module.scss';

export default function UserProfile({ userprofile }: any) {
  return (
    <main>
      <LandingSection>
        <TreeCounter
          target={userprofile.countTarget}
          planted={userprofile.countPlanted}
        />
        <h2 className={styles.treeCounterName}>{userprofile.displayName}</h2>
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
