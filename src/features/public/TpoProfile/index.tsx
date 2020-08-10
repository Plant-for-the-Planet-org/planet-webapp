import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LandingSection from '../../common/Layout/LandingSection';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import styles from './TpoProfile.module.scss';

export default function TpoProfile({ tpoprofile }: any) {
  return (
    <main>
      <LandingSection>
        <div className={styles.landingContent}>
          <TreeCounter
            target={tpoprofile.countTarget}
            planted={tpoprofile.countPlanted}
          />
          <h2 className={styles.treeCounterName}>{tpoprofile.displayName}</h2>
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
