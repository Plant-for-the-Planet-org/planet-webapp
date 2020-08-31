import { Col, Row } from 'react-bootstrap';
import styles from './../LeaderBoard.module.scss';
export default function Blogs() {
  const blogs = [
    {
      id: 1,
      treeCount: '1000000',
      name:
        'Public policy and advocacy work - CA Climate Justice Corps proposal',
      imagePath: '/tenants/salesforce/images/Blog/1.png',
      link: '',
    },
    {
      id: 2,
      treeCount: '500000',
      name: 'Planting trees in the Andes with Accion Andina ',
      imagePath: '/tenants/salesforce/images/Blog/1.png',
      link: '',
    },
    {
      id: 3,
      treeCount: '500000',
      name: 'Youth education and engagement',
      imagePath: '/tenants/salesforce/images/Blog/1.png',
      link: '',
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
                  <p className={styles.blogLink}>Learn More</p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}
