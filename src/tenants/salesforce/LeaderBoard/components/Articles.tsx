import { Col, Row } from 'react-bootstrap';
import styles from './../LeaderBoard.module.scss';
export default function Articles() {
  const articles = [
    {
      id: 1,
      articleDescription:
        'Since 2017 we’ve supported carbon projects, such as restoring mangrove forests in Myanmar while working with the local population to adapt to more sustainable practices.',
      name: 'Sea of Change',
      imagePath: '/tenants/salesforce/images/Articles/1.png',
      link: 'https://www.cooleffect.org/content/project/sea-of-change',
    },
    {
      id: 2,
      articleDescription:
        'Salesforce supports the four Together With Nature Principles to responsibly tackle the climate crisis, restore biodiversity, and benefit planetary health and human wellbeing.',
      name: 'Together with Nature',
      imagePath: '/tenants/salesforce/images/Articles/2.png',
      link: 'http://www.togetherwithnature.com/',
    },
    {
      id: 3,
      articleDescription:
        'We pledged with other U.S.-based organizations to support almost one billion trees and accelerate the trillion trees movement.',
      name: '1t.org U.S Chapter Launch',
      imagePath: '/tenants/salesforce/images/Articles/3.png',
      link:
        'https://us.1t.org/pledge/mobilizing-and-supporting-the-conservation-restoration-and-growth-of-100m-trees/',
    },
    {
      id: 4,
      articleDescription:
        'Salesforce technology powers this digital platform that crowdsources innovations from ecopreneurs, who are developing solutions to meet the trillion trees goal.',
      name: 'Uplink Trillion Trees Challenge',
      imagePath: '/tenants/salesforce/images/Articles/4.png',
      link:
        'https://uplink.weforum.org/uplink/s/uplink-issue/a002o00000vOf09AAC/trillion-trees',
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

                  <a href={article.link}>
                    <p className={styles.articleLink}>Learn More</p>
                  </a>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}
