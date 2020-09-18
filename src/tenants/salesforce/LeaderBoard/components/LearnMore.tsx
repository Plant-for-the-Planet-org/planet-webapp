import { Col, Row } from 'react-bootstrap';
import styles from './../styles/LearnMore.module.scss';

export default function LearnMore() {
  return (
    <Row className={styles.learnMoreSectionRow}>
      <Col xs={12} md={6} className={styles.learnMoreSection}></Col>
      <Col xs={12} md={6} className={styles.learnMoreSectionText}>
        <h2 className={styles.learnMoreSectionTextHeader}>Getting to work.</h2>
        <p className={styles.learnMoreSectionTextPara}>
          Reaching our goal means tapping into the full power of Salesforce,
          including our technology, capital, and influence. It also means
          refining our programs and methodology over time by sharing with and
          learning from others. That’s why we partnered with Plant for the
          Planet to share progress towards our goal and feature tree projects
          that we support directly.
          <br />
          <br />
          Our methodology for selecting projects continues to evolve, but we
          know every project must be done in a socially and ecologically
          responsible way. That means growing the right tree, in the right
          place, by the right people, for the right reasons, to drive
          long-lasting impact and work towards systems change.
        </p>
      </Col>
    </Row>
  );
}
