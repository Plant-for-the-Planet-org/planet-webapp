import { Col, Row } from 'react-bootstrap';
import styles from './../LeaderBoard.module.scss';

export default function LearnMore() {
  return (
    <Row className={styles.learnMoreSectionRow}>
      <Col xs={12} md={6} className={styles.learnMoreSection}>
        <img
          className={styles.learnMoreTreeImage}
          src={'/tenants/salesforce/images/YellowBGTree.png'}
        />
        <img
          className={styles.learnMoreImage}
          src={'/tenants/salesforce/images/GiantTree.png'}
        />
      </Col>
      <Col xs={12} md={6} className={styles.learnMoreSectionText}>
        <p className={styles.learnMoreSectionTextHeader}>
          Plant a Tree and Take Climate Action
        </p>
        <p className={styles.learnMoreSectionTextPara}>
          It's easy to get involved – choose a tree project to support, or give
          the gift of a tree donation to a friend!
        </p>
        <button className={styles.buttonStyle}>Learn More</button>
      </Col>
    </Row>
  );
}
