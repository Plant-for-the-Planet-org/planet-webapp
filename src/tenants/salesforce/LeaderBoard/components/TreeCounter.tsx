import { Col, Container, Row } from 'react-bootstrap';
import TreeCounter from '../../TreeCounter/TreeCounter';
import styles from './../LeaderBoard.module.scss';
interface Props {
  tenantScore: any;
}
export default function TreeCounterSection(tenantScore: Props) {
  const tenantScoreData = tenantScore.tenantScore
    ? tenantScore.tenantScore.total
    : '';
  return (
    <Container fluid="md">
      <Row className={styles.treeCounterSectionRow}>
        <Col xs={12} md={6} className={styles.treeCounterSectionText}>
          <h2 className={styles.treeCounterSectionTextHeader}>
            Our commitment.
          </h2>
          <p className={styles.treeCounterSectionTextPara}>
            At Salesforce, we believe business is one of the greatest platforms
            for change. We are committed to doing everything we can to step up
            to the urgent challenge of climate change and creating a
            sustainable, low-carbon future for all. That means reducing
            emissions, as well as protecting and improving carbon sinks like
            forests.
            <br />
            <br />
            Salesforce’s tree journey is just starting, and we already know it
            isn’t enough. As a founding partner of 1t.org and in support of the
            trillion tree movement, we hope to catalyze change on a much bigger
            scale by demonstrating, enabling, and advocating for it. As we work
            to meet our goals and set the world on a more just path, we
            encourage every company, every community, and every person to join
            us.
          </p>
          {/* <button className={styles.buttonStyle}>Join Us</button> */}
        </Col>
        <Col xs={12} md={6} className={styles.treeCounterSection}>
          <div className={styles.treeCounterContainer}></div>
          <div className={styles.treeCounter}>
            <TreeCounter target={100000000} planted={tenantScoreData} />
          </div>
          <img
            className={styles.treeCounterImage}
            src={'/tenants/salesforce/images/TreeCounterImage.png'}
            alt="Treecounter Image"
          />
        </Col>
      </Row>
    </Container>
  );
}
