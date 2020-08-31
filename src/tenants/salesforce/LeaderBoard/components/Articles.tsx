import { Col, Row } from 'react-bootstrap';
import styles from './../LeaderBoard.module.scss';
export default function Articles() {
  const articles = [
    {
      id: 1,
      articleDescription:
        'In Myanmar, only 16 percent of the original mangrove forest remains along the coastline. This project helps restore those forests while working with the local population to adapt to more sustainable practices. ',
      name:
        'Public policy and advocacy work - CA Climate Justice Corps proposal',
      imagePath: '/tenants/salesforce/images/Articles/1.png',
      link: '',
    },
    {
      id: 2,
      articleDescription:
        'Salesforce advocates for this legislation that would remove the outdated cap on the Reforestation Trust Fund and nearly quadruple the amount of money available for reforestation across America’s national forests.',
      name: 'Planting trees in the Andes with Accion Andina ',
      imagePath: '/tenants/salesforce/images/Articles/1.png',
      link: '',
    },
  ];

  return (
    <section className={styles.articleSection}>
      <h2 className={styles.articleSectionHeader}>
        Learn About Our Tree Initiatives
      </h2>
      <Row className={styles.articleContainer}>
        {articles.map((article) => {
          return (
            <Col key={article.id} sm={10} lg={6}>
              <div className={styles.articleSingleContainer}>
                <img className={styles.articleImage} src={article.imagePath} />
                {/* <div className={styles.articleImageOverlay}></div> */}
                <div className={styles.articleInfoSection}>
                  <p className={styles.articletreeCount}>{article.treeCount}</p>
                  <p className={styles.articleTitle}>{article.name}</p>
                  <p className={styles.articleLink}>Learn More</p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}
