import styles from './../styles/Timeline.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import React, {useState} from 'react';
import Link from 'next/link';

export default function Timeline() {

  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);

  const moments = [
    {
      id: 1,
      date: 'January 2020',
      image: '/tenants/salesforce/images/jan.png',
      title: '1t.org & Salesforce’s 100M Tree Commitment',
      copy: 'Salesforce partnered with the World Economic Forum to launch <a href="https://www.1t.org/" target="_blank" rel="noreferrer">1t.org</a> and set a goal to support and mobilize the conservation, restoration, and growth of 100 million trees by 2030.',
      learnMore: 'https://www.salesforce.com/news/stories/one-trillion-trees-to-combat-climate-change-why-its-not-so-outlandish/'
    },
    {
      id: 2,
      date: 'July 2020',
      image: '/tenants/salesforce/images/jul.png',
      title: 'UpLink Trillion Tree Challenge',
      copy: 'The World Economic Forum launched the Trillion Trees Challenge on UpLink, a platform built on Salesforce technology to connect the next generation of change-makers to resources, professional expertise, and capital to create an impact.',
      learnMore: 'https://uplink.weforum.org/uplink/s/uplink-issue/a002o00000vOf09AAC/trillion-trees'
    },
    {
      id: 3,
      date: 'August 2020',
      image: '/tenants/salesforce/images/aug.png',
      title: '1t.org US Chapter',
      copy: 'Salesforce helped launch the <a href="https://www.1t.org/" target="_blank" rel="noreferrer">1t.org</a> U.S. Chapter with 25 companies, nonprofit organizations, and governments pledging to conserve, restore, and grow almost 1 billion trees by 2030.',
      learnMore: ''
    },
    {
      id: 4,
      date: 'September 2020',
      image: '/tenants/salesforce/images/sep.png',
      title: ' Salesforce’s Tree Tracker',
      copy: 'The tree tracker is an essential piece of Salesforce’s work to share resources and provide transparency to our stakeholders.',
      learnMore: 'https://us.1t.org/view-pledges/'
    },
    {
      id: 5,
      date: 'March 2021',
      image: '/tenants/salesforce/images/mar.png',
      title: '10M Trees Milestone',
      copy: 'With Salesforce’s TREEmendous partners and generous supporters, we’ve funded over 10 million trees in just over 12 months!\n',
      learnMore: 'https://www.salesforce.com/news/stories/10-million-trees-milestone-update/'
    }
  ];

  const populateSlide = (slides, slideIndex) => {
    return (
      <div className={styles.timelineMoment} id={`desktop-timeline-moment-${slideIndex}`}>
        <div className={gridStyles.gridRow}>
          {slides.map((moment) => {
            return (
              <div className={`${styles.timelineContent} ${gridStyles.colMd4}`} key={`desktop-moment-${moment.id}`}>
                <span className={styles.timelineDate}>{moment.date}</span>
                <img src={moment.image} alt="" className={styles.timelineImage}/>
                <h4>{moment.title}</h4>
                <p dangerouslySetInnerHTML={{__html: moment.copy}} />
                <a href={moment.learnMore} className={styles.timelineLearnMore} target="_blank" rel="noreferrer">learn more</a>
              </div>
            );
          })}
        </div>
      </div>
    )
  }

  function desktopSlider() {
    let m = [];
    const mReturn = [];
    let slideIndex = 0;

    moments.forEach(( moment, index) => {
      m.push(moment);
      if(m.length === 3 || index+1 === moments.length){
        mReturn.push(populateSlide(m, slideIndex));
        m = [];
        slideIndex++;
      }
    });

    return mReturn;
  }

  function desktopDots() {
    const dots = [];

    for (let i = 0; i < Math.ceil(moments.length/3); i++) {
      dots.push(<Link
        href={`#desktop-timeline-moment-${i}`}
        scroll={false}
      >
        <button
          className={styles.timelineButtonDot}
          disabled={desktopCurrent === i}
          aria-disabled={desktopCurrent === i}
          onClick={()=>setDesktopCurrent(i)}>
          <span className={`${desktopCurrent === i ? styles.timelineDotDisabled : styles.timelineDot}`} />
        </button>
      </Link>);
    }
    return dots;
  }

  function mobileDots() {
    const dots = [];

    for (let i = 0; i < moments.length; i++) {
      dots.push(<Link
        href={`#mobile-timeline-moment-${i}`}
        scroll={false}
      >
        <button
          className={styles.timelineButtonDot}
          disabled={mobileCurrent === i}
          aria-disabled={mobileCurrent === i}
          onClick={()=>setMobileCurrent(i)}>
          <span className={`${mobileCurrent === i ? styles.timelineDotDisabled : styles.timelineDot}`} />
        </button>
      </Link>);
    }
    return dots;
  }

  return (
    <section className={styles.timelineSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>Follow us on our tree journey.</h3>
          </div>
        </div>
      </div>
      <div className={styles.timelineRow}>
        <div className={gridStyles.fluidContainer}>
          <div className={styles.timelineDesktop}>
            {desktopSlider()}
          </div>
          <div className={styles.timelineMobile}>
            {moments.map((moment, index) => {
              return (
                <div className={`${styles.timelineContent} ${styles.timelineMoment}`} key={`mobile-moment-${moment.id}`} id={`mobile-timeline-moment-${index}`}>
                  <span className={styles.timelineDate}>{moment.date}</span>
                  <img src={moment.image} alt="" className={styles.timelineImage}/>
                  <h4>{moment.title}</h4>
                  <p dangerouslySetInnerHTML={{__html: moment.copy}} />
                  <a href={moment.learnMore} className={styles.timelineLearnMore} target="_blank" rel="noreferrer">learn more</a>
                </div>
              );
            })}
          </div>
          <div className={styles.timelineDesktopNav}>
            <Link
              href={`#desktop-timeline-moment-${desktopCurrent-1}`}
              scroll={false}
            >
              <button
                className={styles.timelineButtonArrowPrev}
                disabled={desktopCurrent === 0}
                aria-disabled={desktopCurrent === 0}
                onClick={()=>setDesktopCurrent(desktopCurrent-1)}>
                <img src="/tenants/salesforce/images/arrow-prev.png" alt="" className={styles.timelineArrow}/>
              </button>
            </Link>
            {desktopDots()}
            <Link
              href={`#desktop-timeline-moment-${desktopCurrent+1}`}
              scroll={false}
            >
              <button
                className={styles.timelineButtonArrowNext}
                onClick={()=>setDesktopCurrent(desktopCurrent+1)}
                disabled={desktopCurrent+1 === Math.ceil(moments.length/3)}
                aria-disabled={desktopCurrent+1 === Math.ceil(moments.length/3)}
              >
                <img src="/tenants/salesforce/images/arrow-next.png" alt="" className={styles.timelineArrow} />
              </button>
            </Link>
          </div>
          <div className={styles.timelineMobileNav}>
            <Link
              href={`#mobile-timeline-moment-${mobileCurrent-1}`}
              scroll={false}
            >
              <button
                className={styles.timelineButtonArrowPrev}
                disabled={mobileCurrent === 0}
                aria-disabled={mobileCurrent === 0}
                onClick={()=>setMobileCurrent(mobileCurrent-1)}>
                <img src="/tenants/salesforce/images/arrow-prev.png" alt="" className={styles.timelineArrow}/>
              </button>
            </Link>
            {mobileDots()}
            <Link
              href={`#mobile-timeline-moment-${mobileCurrent+1}`}
              scroll={false}
            >
              <button
                className={styles.timelineButtonArrowNext}
                onClick={()=>setMobileCurrent(mobileCurrent+1)}
                disabled={mobileCurrent+1 === moments.length}
                aria-disabled={mobileCurrent+1 === moments.length}
              >
                <img src="/tenants/salesforce/images/arrow-next.png" alt="" className={styles.timelineArrow} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
