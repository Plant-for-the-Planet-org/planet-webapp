import { Col, Container, Row } from 'react-bootstrap';
import TreeCounter from '../../TreeCounter/TreeCounter';
import styles from './../LeaderBoard.module.scss';

export default function TreeCounterSection() {
  return (
    <Container fluid="md">
      <Row className={styles.treeCounterSectionRow}>
        <Col xs={12} md={6} className={styles.treeCounterSectionText}>
          <h2 className={styles.treeCounterSectionTextHeader}>
            Take climate action.
          </h2>
          <p className={styles.treeCounterSectionTextPara}>
            Trees and forests are a critical nature-based solution to solve the
            global climate crisis. While not a silver bullet, forests are our
            best tool to remove carbon from the atmosphere.
            <br />
            <br />
            It's easy to get involved – select your favorite tree project to
            support, or give the gift of a tree donation to a friend!
          </p>
          {/* <button className={styles.buttonStyle}>Join Us</button> */}
        </Col>
        <Col xs={12} md={6} className={styles.treeCounterSection}>
          <div className={styles.treeCounterContainer}></div>
          <div className={styles.treeCounter}>
            <TreeCounter target={100000000} planted={24.3} />
          </div>
          <img
            className={styles.treeCounterImage}
            src={'/tenants/salesforce/images/TreeCounterImage.png'}
            alt=""
          />
        </Col>
      </Row>
    </Container>
  );
}
