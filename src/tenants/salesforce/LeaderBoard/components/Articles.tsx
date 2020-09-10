import { Col, Row } from 'react-bootstrap';
import styles from './../LeaderBoard.module.scss';
export default function Articles() {
  const articles = [
    {
      id: 1,
      articleDescription:
        'In Myanmar, only 16 percent of the original mangrove forest remains along the coastline. This project helps restore those forests while working with the local population to adapt to more sustainable practices. ',
      name: 'Sea of Change: Restoring Mangroves',
      imagePath: '/tenants/salesforce/images/Articles/1.png',
      link: '',
    },
    {
      id: 2,
      articleDescription:
        'Salesforce advocates for this legislation that would remove the outdated cap on the Reforestation Trust Fund and nearly quadruple the amount of money available for reforestation across America’s national forests.',
      name: 'Advocacy Efforts',
      imagePath: '/tenants/salesforce/images/Articles/2.png',
      link: '',
    },
    {
      id: 3,
      articleDescription:
        'Salesforce joins U.S. organizations committed to supporting almost one billion trees to accelerate the Trillion Trees movement.',
      name: '1t.org U.S Chapter Pledge to Scale Action',
      imagePath: '/tenants/salesforce/images/Articles/3.png',
      link: '',
    },
    {
      id: 4,
      articleDescription:
        'Salesforce technology powers this digital platform that crowdsources innovations from ecopreneurs, who are developing solutions to meet the Trillion Trees goal.',
      name: 'Uplink Trillion Trees Challenge',
      imagePath: '/tenants/salesforce/images/Articles/4.png',
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
                <img
                  className={styles.articleImage}
                  src={article.imagePath}
                  alt={'Image of ' + article.name}
                />
                {/* <div className={styles.articleImageOverlay}></div> */}
                <div className={styles.articleInfoSection}>
                  <h3 className={styles.articleTitle}>{article.name}</h3>
                  <p className={styles.articleDescription}>
                    {article.articleDescription}
                  </p>

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
