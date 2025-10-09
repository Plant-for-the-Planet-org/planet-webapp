import styles from './../styles/Timeline.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import { useState } from 'react';
import Link from 'next/link';

const moments = [
  {
    id: 1,
    date: 'January 2020',
    image: '/tenants/salesforce/images/jan-20.png',
    title: '1t.org Created & 100m Tree Commitment',
    copy: 'Salesforce partnered with the World Economic Forum to launch <a href="https://www.1t.org/" target="_blank" rel="noreferrer">1t.org</a> and set a goal to support and mobilize the conservation, restoration, and growth of 100 million trees by 2030.',
    learnMore:
      'https://www.salesforce.com/news/stories/one-trillion-trees-to-combat-climate-change-why-its-not-so-outlandish/',
  },
  {
    id: 2,
    date: 'July 2020',
    image: '/tenants/salesforce/images/july-20.png',
    title: 'UpLink Trillion Tree Challenge',
    copy: 'The World Economic Forum launched the Trillion Trees Challenge on UpLink, a platform built on Salesforce technology to connect the next generation of change-makers to resources, professional expertise, and capital to create an impact.',
    learnMore:
      'https://uplink.weforum.org/uplink/s/uplink-issue/a002o00000vOf09AAC/trillion-trees',
  },
  {
    id: 3,
    date: 'August 2020',
    image: '/tenants/salesforce/images/aug-20.png',
    title: '1t.org US Chapter',
    copy: 'The <a href="https://www.1t.org/" target="_blank" rel="noreferrer">1t.org</a> U.S. Chapter launched with 26 companies, nonprofit organizations, and governments pledging to conserve, restore, and grow almost one billion trees by 2030.',
    learnMore: 'https://us.1t.org/view-pledges/',
  },
  {
    id: 4,
    date: 'September 2020',
    image: '/tenants/salesforce/images/sept-20.png',
    title: ' Salesforce’s Tree Tracker',
    copy: 'The tree tracker is an essential piece of our work to share resources and provide transparency to our stakeholders.',
    learnMore:
      'https://www.salesforce.com/news/stories/salesforce-partners-with-plant-for-the-planet-to-spotlight-global-reforestation-projects-and-track-progress-towards-100-million-tree-goal/',
  },
  {
    id: 5,
    date: 'March 2021',
    image: '/tenants/salesforce/images/march-21.png',
    title: '10M Trees Milestone',
    // cspell:ignore TREEmendous
    copy: 'With our TREEmendous partners and generous supporters, we’ve funded over 10 million trees in just over 12 months!',
    learnMore:
      'https://www.salesforce.com/news/stories/10-million-trees-milestone-update/',
  },
  {
    id: 6,
    date: 'September 2021',
    image: '/tenants/salesforce/images/sept-21.png',
    title: 'Mangrove Working Group',
    copy: 'Led by Friends of Ocean Action in collaboration with <a href="https://www.1t.org/" target="_blank" rel="noreferrer">1t.org</a>, this working group will build the capacity of demand-side stakeholders to tap into the growing blue carbon market. Salesforce joins to champion the effort and learn from the work.',
    learnMore: '',
  },
];

export default function Timeline() {
  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);

  const populateSlide = (slides, slideIndex) => {
    return (
      <div
        className={styles.timelineMoment}
        id={`desktop-timeline-moment-${slideIndex}`}
        key={slideIndex}
      >
        <h3>We’re hitting important milestones.</h3>
        <div className={gridStyles.gridRow}>
          {slides.map((moment) => {
            return (
              <div
                className={`${styles.timelineContent} ${gridStyles.colMd6}`}
                key={`desktop-moment-${moment.id}`}
              >
                <img
                  src={moment.image}
                  alt=""
                  className={styles.timelineImage}
                />
                <span className={styles.timelineDate}>{moment.date}</span>
                <h4>{moment.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: moment.copy }} />
                {moment.learnMore && (
                  <a
                    href={moment.learnMore}
                    className={styles.timelineLearnMore}
                    target="_blank"
                    rel="noreferrer"
                  >
                    learn more
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function desktopSlider() {
    let m = [];
    const mReturn = [];
    let slideIndex = 0;

    moments.forEach((moment, index) => {
      m.push(moment);
      if (m.length === 2 || index + 1 === moments.length) {
        mReturn.push(populateSlide(m, slideIndex));
        m = [];
        slideIndex++;
      }
    });

    return mReturn;
  }

  function desktopDots() {
    return (
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{
            width:
              (
                ((desktopCurrent + 1) / Math.ceil(moments.length / 2)) *
                100
              ).toString() + '%',
          }}
        ></div>
      </div>
    );
  }

  function mobileDots() {
    return (
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{
            width:
              (
                ((mobileCurrent + 1) / Math.ceil(moments.length)) *
                100
              ).toString() + '%',
          }}
        ></div>
      </div>
    );
  }

  return (
    <section className={styles.timelineSection}>
      <div>
        <div className={`${gridStyles.fluidContainer} ${styles.timelineRow}`}>
          <Link
            href={`#desktop-timeline-moment-${desktopCurrent - 1}`}
            scroll={false}
          >
            <button
              className={`${styles.timelineButtonArrowPrev} ${styles.showDesktop}`}
              disabled={desktopCurrent === 0}
              aria-disabled={desktopCurrent === 0}
              onClick={() => setDesktopCurrent(desktopCurrent - 1)}
            >
              <img
                src="/tenants/salesforce/images/arrow-left.png"
                alt=""
                className={styles.timelineArrow}
              />
            </button>
          </Link>
          <Link
            href={`#mobile-timeline-moment-${mobileCurrent - 1}`}
            scroll={false}
          >
            <button
              className={`${styles.timelineButtonArrowPrev} ${styles.showMobile}`}
              disabled={mobileCurrent === 0}
              aria-disabled={mobileCurrent === 0}
              onClick={() => setMobileCurrent(mobileCurrent - 1)}
            >
              <img
                src="/tenants/salesforce/images/arrow-left.png"
                alt=""
                className={styles.timelineArrow}
              />
            </button>
          </Link>
          <div className={styles.timelineDesktop}>{desktopSlider()}</div>
          <div className={styles.timelineMobile}>
            {moments.map((moment, index) => {
              return (
                <div
                  className={`${styles.timelineContent} ${styles.timelineMoment}`}
                  key={`mobile-moment-${moment.id}`}
                  id={`mobile-timeline-moment-${index}`}
                >
                  <h3>Follow us on our tree journey.</h3>
                  <img
                    src={moment.image}
                    alt=""
                    className={styles.timelineImage}
                  />
                  <span className={styles.timelineDate}>{moment.date}</span>
                  <h4>{moment.title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: moment.copy }} />
                  <a
                    href={moment.learnMore}
                    className={styles.timelineLearnMore}
                    target="_blank"
                    rel="noreferrer"
                  >
                    learn more
                  </a>
                </div>
              );
            })}
          </div>
          <div className={styles.timelineDesktopNav}>{desktopDots()}</div>
          <div className={styles.timelineMobileNav}>{mobileDots()}</div>
          <Link
            href={`#mobile-timeline-moment-${mobileCurrent + 1}`}
            scroll={false}
          >
            <button
              className={`${styles.timelineButtonArrowNext} ${styles.showMobile}`}
              onClick={() => setMobileCurrent(mobileCurrent + 1)}
              disabled={mobileCurrent + 1 === moments.length}
              aria-disabled={mobileCurrent + 1 === moments.length}
            >
              <img
                src="/tenants/salesforce/images/arrow-right.png"
                alt=""
                className={styles.timelineArrow}
              />
            </button>
          </Link>
          <Link
            href={`#desktop-timeline-moment-${desktopCurrent + 1}`}
            scroll={false}
          >
            <button
              className={`${styles.timelineButtonArrowNext} ${styles.showDesktop}`}
              onClick={() => setDesktopCurrent(desktopCurrent + 1)}
              disabled={desktopCurrent + 1 === Math.ceil(moments.length / 2)}
              aria-disabled={
                desktopCurrent + 1 === Math.ceil(moments.length / 2)
              }
            >
              <img
                src="/tenants/salesforce/images/arrow-right.png"
                alt=""
                className={styles.timelineArrow}
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
