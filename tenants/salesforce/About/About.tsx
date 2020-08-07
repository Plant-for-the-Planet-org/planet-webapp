import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
import TreeCounter from './../TreeCounter/TreeCounter';
import styles from './About.module.scss';
export default function About() {
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

  const articles = [
    {
      id: 1,
      treeCount: '1000000',
      name:
        'Public policy and advocacy work - CA Climate Justice Corps proposal',
      imagePath: '/tenants/salesforce/images/Articles/1.png',
      link: '',
    },
    {
      id: 2,
      treeCount: '500000',
      name: 'Planting trees in the Andes with Accion Andina ',
      imagePath: '/tenants/salesforce/images/Articles/1.png',
      link: '',
    },
  ];

  const [selectedTab, setSelectedTab] = React.useState('recent');
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

      <section className={styles.leaderBoardSection}>
        <div className={styles.leaderBoard}>
          <h3>Salesforce</h3>
          <h2>Forest Frontrunners</h2>
          <div className={styles.leaderBoardTable}>
            <div className={styles.leaderBoardTableHeader}>
              <div
                onClick={() => setSelectedTab('recent')}
                className={
                  selectedTab === 'recent'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
              >
                Most Recent
              </div>
              <div
                onClick={() => setSelectedTab('highest')}
                className={
                  selectedTab === 'highest'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
              >
                Most Trees
              </div>
            </div>
            <div className={styles.leaderBoardBody}>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>

              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>

              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
              <div className={styles.leaderBoardBodyRow}>
                <p className={styles.leaderBoardDonorName}>Tin Lee</p>
                <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
                <p className={styles.leaderBoardDonorTime}>30m ago</p>
              </div>
            </div>
          </div>
        </div>
        <img
          className={styles.leaderBoardBushImage}
          src={'/tenants/salesforce/images/Bush.png'}
        />
      </section>

      <section className={styles.articleSection}>
        <Row className={styles.articleContainer}>
          {articles.map((article) => {
            return (
              <Col key={article.id} sm={10} lg={6}>
                <div className={styles.articleSingleContainer}>
                  <img
                    className={styles.articleImage}
                    src={article.imagePath}
                  />
                  <div className={styles.articleImageOverlay}></div>
                  <div className={styles.articleInfoSection}>
                    <p className={styles.articletreeCount}>
                      {article.treeCount}
                    </p>
                    <p className={styles.articleTitle}>{article.name}</p>
                    <p className={styles.articleLink}>Learn More</p>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </section>

      <section className={styles.blogSection}>
        <p className={styles.blogSectionHeader}>
          Get involved and start planting
        </p>
        <Row className={styles.blogContainer}>
          {blogs.map((blog) => {
            return (
              <Col key={blog.id} sm={10} lg={4}>
                <div className={styles.blogSingleContainer}>
                  <img className={styles.blogImage} src={blog.imagePath} />
                  <div className={styles.blogImageOverlay}></div>
                  <div className={styles.blogInfoSection}>
                    <p className={styles.blogtreeCount}>{blog.treeCount}</p>
                    <p className={styles.blogTitle}>{blog.name}</p>
                    <p className={styles.blogLink}>Learn More</p>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </section>
    </main>
  );
}
