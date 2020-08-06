import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import LazyLoad from 'react-lazyload';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import styles from './TpoProfile.module.scss';

export default function TpoProfile({ tpoprofile }: any) {
  console.log('TPO data', tpoprofile);

  return (
    <main>
      <section className={styles.landingSection}>
        <div className={styles.backgroundImage}>
          <LazyLoad>
            <Image fluid src={'/static/images/home/BGHome.jpg'} />
          </LazyLoad>
        </div>

        <div className={styles.landingContent}>
          <TreeCounter
            target={tpoprofile.countTarget}
            planted={tpoprofile.countPlanted}
          />
          <h2 className={styles.treeCounterName}>
            {tpoprofile.displayName}
            {/* Paulina <span style={{ fontWeight: 400 }}>Sanchez</span> */}
          </h2>
          {/* <p className={styles.treeCounterAbout}>
            I grew up planting trees with Plant-for-the-Planet and since 2013,
            we’ve planted over 6 Million trees near my hometown in Yucatan, Join
            the app, and plant some more!
          </p> */}
        </div>
      </section>

      <Container fluid="md">
        <Row className={styles.aboutSection}>
          <Col xs={12} md={6} className={styles.aboutSectionImages}></Col>
          <Col xs={12} md={6} className={styles.aboutSectionText}></Col>
        </Row>
      </Container>
    </main>
  );
}
