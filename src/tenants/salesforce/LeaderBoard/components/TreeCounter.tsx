import { Col, Container, Row } from 'react-bootstrap';
import TreeCounter from '../../TreeCounter/TreeCounter';
import styles from './../LeaderBoard.module.scss';

export default function TreeCounterSection() {
  return (
    <Container fluid="md">
      <Row className={styles.treeCounterSectionRow}>
        <Col xs={12} md={6} className={styles.treeCounterSectionText}>
          <p className={styles.treeCounterSectionTextHeader}>
            The clock is ticking on climate change.
          </p>
          <p className={styles.treeCounterSectionTextPara}>
            Salesforce supports 1t.org, an initiative led by the World Economic
            Forum to conserve, restore, and plant 1 trillion trees by 2030 to
            help slow the planet’s rising temperatures. To that end, Salesforce
            set a goal to support and mobilize the conservation and restoration
            of 100 million trees over the next decade.
          </p>
          <button className={styles.buttonStyle}>Join Us</button>
        </Col>
        <Col xs={12} md={6} className={styles.treeCounterSection}>
          <div className={styles.treeCounter}>
            <TreeCounter target={100000000} planted={24300000} />
          </div>
          <img
            className={styles.treeCounterImage}
            src={'/tenants/salesforce/images/TreeCounterImage.png'}
          />
        </Col>
      </Row>
    </Container>
  );
}
