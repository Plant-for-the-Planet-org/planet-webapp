import { Col, Container, Row } from 'react-bootstrap';
import TreeCounter from '../../TreeCounter/TreeCounter';
import styles from './../styles/TreeCounter.module.scss';
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
            Getting to work.
          </h2>
          <p className={styles.treeCounterSectionTextPara}>
            Even though our journey is just starting, we know it will take the
            full power of Salesforce - including our technology, capital,
            influence, and network - to get there. And we know there’s no time
            to waste. We know we’ll have to refine our programs and methodology
            over time, by sharing with and learning from others. That’s why
            we’ve launched this resource.
            <br />
            <br />
            Check out the “Donate” tab to see some of the places where we’re
            supporting tree planting organizations and lend your support! The
            tracker to the right and leaderboard below reflect all the donations
            made and registered on this platform. Also below, you’ll find
            examples of our other initiatives as well as resources to get
            involved. We’ll continue to add projects, programs, and resources so
            check back often!
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
