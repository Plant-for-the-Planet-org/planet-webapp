import { Col, Container, Row } from 'react-bootstrap';
import styles from './../About.module.scss';

export default function TheChangeChocolate() {
  return (
    <Container fluid="md">
      <Row className={styles.changeChocolateSection}>
        <Col xs={12} md={8} className={styles.changeChocolateSectionText}>
          <p className={styles.changeChocolateSectionTextHeader}>
            The Change Chocolate
          </p>
          <p className={styles.changeChocolateSectionTextPara}>
            The chocolate that plants trees.
          </p>
          <p className={styles.changeChocolateSectionTextPara}>
            21M bars sold • 5M trees planted
          </p>
          <div className={styles.changeChocolateSectionTextLinkContainer}>
            <p className={styles.changeChocolateSectionTextLink}>Learn More</p>
            <p className={styles.changeChocolateSectionTextLink}>
              Chocolate Code
            </p>
            <p className={styles.changeChocolateSectionTextLink}>Order</p>
          </div>
          <img
            style={{ width: '100%' }}
            src={'/tenants/planet/images/home/Chocolate.jpg'}
          />
        </Col>
      </Row>
    </Container>
  );
}
