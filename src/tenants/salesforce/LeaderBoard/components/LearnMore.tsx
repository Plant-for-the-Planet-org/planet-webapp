import { Col, Row } from 'react-bootstrap';
import styles from './../styles/LearnMore.module.scss';

export default function LearnMore() {
  return (
    <Row className={styles.learnMoreSectionRow}>
      <Col xs={12} md={6} className={styles.learnMoreSection}></Col>
      <Col xs={12} md={6} className={styles.learnMoreSectionText}>
        <h2 className={styles.learnMoreSectionTextHeader}>
          It's bigger than the trees.
        </h2>
        <p className={styles.learnMoreSectionTextPara}>
          We’re committed to doing everything we can to step up to the urgent
          challenge of climate change and creating a sustainable, low-carbon
          future for all. That means reducing emissions, as well as protecting
          and improving carbon sinks like forests.
          <br />
          <br />
          Forests, which are critical to the health of our planet, covered about
          half the earth before the agricultural revolution began. In the 8,000
          years since, while we’ve managed to feed and house billions of people,
          we’ve also lost or degraded half of those forests, fueling a
          biodiversity collapse and the climate crisis. It’s time we stop taking
          from our natural ecosystems, and start giving back.
        </p>
      </Col>
    </Row>
  );
}
