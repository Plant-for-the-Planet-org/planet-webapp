import styles from './../styles/Timeline.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import slickStyles from './../styles/Slick.module.scss';
import Slider from "react-slick";

interface Props {
  currentSlide: any;
  slideCount: any;
  props: any;
}

export default function Timeline() {
  const SlickArrowPrev = ({ currentSlide, slideCount, ...props }: Props) => (
    <button {...props} className='slick-prev'><img src="/tenants/salesforce/images/arrow-prev.png" alt="" /></button>
  );

  const SlickArrowNext = ({ currentSlide, slideCount, ...props }: Props) => (
    <button {...props} className='slick-next'><img src="/tenants/salesforce/images/arrow-next.png" alt="" /></button>
  );

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowPrev />,
    nextArrow: <SlickArrowNext />,
  };
  const moments = [
    {
      id: 1,
      date: 'January 2020',
      image: '/tenants/salesforce/images/jan.png',
      title: '1t.org & Salesforce’s 100M Tree Commitment',
      copy: 'Salesforce partnered with the World Economic Forum to launch <a href="https://www.1t.org/" target="_blank" rel="noreferrer">1t.org</a> and set a goal to support and mobilize the conservation, restoration, and growth of 100 million trees by 2030.',
      learnMore: ''
    },
    {
      id: 2,
      date: 'July 2020',
      image: '/tenants/salesforce/images/jul.png',
      title: 'UpLink Trillion Tree Challenge',
      copy: 'The World Economic Forum launched the Trillion Trees Challenge on UpLink, a platform built on Salesforce technology to connect the next generation of change-makers to resources, professional expertise, and capital to create an impact.',
      learnMore: ''
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
      learnMore: ''
    },
    {
      id: 5,
      date: 'March 2021',
      image: '/tenants/salesforce/images/mar.png',
      title: '10M Trees Milestone',
      copy: 'With Salesforce’s TREEmendous partners and generous supporters, we’ve funded over 10 million trees in just over 12 months!\n',
      learnMore: ''
    }
  ];

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
          <div className={`${slickStyles.slickSlider}`}>
            <Slider
              {...settings}
            >
              {moments.map((moment) => {
                return (
                  <div className={`${styles.timelineContent}`} key={`moment-${moment.id}`}>
                    <span className={styles.timelineDate}>{moment.date}</span>
                    <img src={moment.image} alt="" className={styles.timelineImage}/>
                    <h4>{moment.title}</h4>
                    <p dangerouslySetInnerHTML={{__html: moment.copy}} />
                    <a href={moment.learnMore} className={styles.timelineLearnMore} target="_blank" rel="noreferrer">learn more</a>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}
