import { Col, Container, Row } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
import TreeCounter from './../TreeCounter/TreeCounter';
import styles from './About.module.scss';
export default function About() {
  const blogs = [
    {
      id: 1,
      location: 'Mexico',
      name: 'Reforestation in Tough Times',
      imagePath: '/static/images/home/Blog1.jpg',
      link: '',
    },
    {
      id: 2,
      location: 'Italy',
      name: 'Climate Justice Ambassador Receives Environmental Award',
      imagePath: '/static/images/home/Blog1.jpg',
      link: '',
    },
    {
      id: 3,
      location: 'Germany',
      name: 'In Memoriam of Wangari Maathai',
      imagePath: '/static/images/home/Blog1.jpg',
      link: '',
    },
  ];
  return (
    <main>
      <section className={styles.landingSection}>
        <div className={styles.backgroundImage}>
          <LazyLoad>
            <img src={'/tenants/salesforce/images/Background.png'} />
          </LazyLoad>
        </div>

        <div className={styles.landingContent}>
          <h2>Plant the Seeds for a More Sustainable Future</h2>
          <p>
            To address climate change, we need to do two things: cut emissions
            and draw down the carbon in the atmosphere. In terms of carbon
            drawdown, forests are our largest, most advanced tool.
          </p>
          <button className={styles.buttonStyle}>
            Plant Trees with Salesforce
          </button>
        </div>
      </section>

      <Container fluid="md">
        <Row className={styles.treeCounterSectionRow}>
          <Col xs={12} md={6} className={styles.treeCounterSectionText}>
            <p className={styles.treeCounterSectionTextHeader}>
              The clock is ticking on climate change.
            </p>
            <p className={styles.treeCounterSectionTextPara}>
              Salesforce supports 1t.org, an initiative led by the World
              Economic Forum to conserve, restore, and plant 1 trillion trees by
              2030 to help slow the planet’s rising temperatures. To that end,
              Salesforce set a goal to support and mobilize the conservation and
              restoration of 100 million trees over the next decade.
            </p>
            <button className={styles.buttonStyle}>Join Us</button>
          </Col>
          <Col xs={12} md={6} className={styles.treeCounterSection}>
            <div className={styles.treeCounter}>
              <TreeCounter target={100000000} planted={24300000} />
            </div>
            <img
              className={styles.treeCounterImage}
              src={'/tenants/salesforce/images/TreeCounterImage.png'}
            />
          </Col>
        </Row>
      </Container>

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
            It's easy to get involved – choose a tree project to support, or
            give the gift of a tree donation to a friend!
          </p>
          <button className={styles.buttonStyle}>Learn More</button>
        </Col>
      </Row>

      <section className={styles.blogSection}>
        <p className={styles.blogSectionHeader}>What’s new?</p>
        <Row className={styles.blogContainer}>
          {blogs.map((blog) => {
            return (
              <Col key={blog.id} sm={10} lg={4}>
                <div className={styles.blogSingelContainer}>
                  <img className={styles.blogImage} src={blog.imagePath} />
                  <p className={styles.blogLocation}>{blog.location}</p>
                  <p className={styles.blogTitle}>{blog.name}</p>
                  <p className={styles.blogLink}>Read</p>
                </div>
              </Col>
            );
          })}
        </Row>
      </section>
    </main>
  );
}
