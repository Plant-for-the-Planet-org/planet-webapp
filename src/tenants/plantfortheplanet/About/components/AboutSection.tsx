import { Col, Container, Row } from 'react-bootstrap';
import styles from './../About.module.scss';

export default function AboutSection() {
  return (
    <Container fluid="md">
      <Row className={styles.aboutSection}>
        <Col xs={12} md={6} className={styles.aboutSectionImages}>
          <img
            style={{ width: '100%' }}
            src={'/static/images/home/About1.jpg'}
          />
          <img
            style={{ width: '48%', marginTop: '16px' }}
            src={'/static/images/home/About2.jpg'}
          />
          <img
            style={{ width: '48%', marginTop: '16px' }}
            src={'/static/images/home/About3.jpg'}
          />
        </Col>
        <Col xs={12} md={6} className={styles.aboutSectionText}>
          <p className={styles.aboutSectionTextHeader}>
            We Make Ourselves Heard{' '}
          </p>
          <p className={styles.aboutSectionTextPara}>
            Over 80 thousand 10–14 year olds have joined us to learn about the
            climate crisis, give speeches to mobilize adults and plant trees
          </p>
          <p className={styles.aboutSectionTextLink}>Join Us</p>
        </Col>
      </Row>
    </Container>
  );
}
