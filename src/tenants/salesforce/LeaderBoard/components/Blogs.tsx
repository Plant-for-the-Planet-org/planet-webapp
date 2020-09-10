import { Col, Row } from 'react-bootstrap';
import styles from './../LeaderBoard.module.scss';
export default function Blogs() {
  const blogs = [
    {
      id: 1,
      name:
        'Learn how trees play a key role in addressing climate change and how you can be a climate champion',
      imagePath: '/tenants/salesforce/images/Blog/1.png',
      link: '',
      linkTitle: 'Hit the Trail on Trailhead',
    },
    {
      id: 2,
      name:
        'Make working-from-home more comfortable, productive, and sustainable',
      imagePath: '/tenants/salesforce/images/Blog/2.png',
      link: '',
      linkTitle: 'Read the Wellbeing at Home Guide',
    },
    {
      id: 3,
      name:
        'Drawing parallels between COVID-19 and climate change could be the key to a healthier, more sustainable future',
      imagePath: '/tenants/salesforce/images/Blog/3.png',
      link: '',
      linkTitle: 'Learn More on Newsroom',
    },
  ];

  return (
    <section className={styles.blogSection}>
      <p className={styles.blogSectionHeader}>Resources</p>
      <Row className={styles.blogContainer}>
        {blogs.map((blog) => {
          return (
            <Col key={blog.id} sm={10} lg={4} xl={4}>
              <div className={styles.blogSingleContainer}>
                <img className={styles.blogImage} src={blog.imagePath} />
                <div className={styles.blogImageOverlay}></div>
                <div className={styles.blogInfoSection}>
                  {/* <p className={styles.blogtreeCount}>{blog.treeCount}</p> */}
                  <p className={styles.blogTitle}>{blog.name}</p>
                  <p className={styles.blogLink}>{blog.linkTitle}</p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}
