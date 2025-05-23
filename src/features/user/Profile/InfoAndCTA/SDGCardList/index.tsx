import React, { useState } from 'react';
import CarouselSlider from '../../../../common/CarouselSlider';
import { useTranslations } from 'next-intl';
import styles from '../InfoAndCta.module.scss';

const SDGCardList = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('Profile');
  const settings = {
    infinite: false,
    slidesToShow: 7,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlide(current),
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 620,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 570,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 380,
        settings: {
          centerMode: false,
          slidesToShow: 1,
        },
      },
    ],
  };

  const sdgCardImageLinks = [
    {
      key: t('infoAndCtaContainer.sdgCardAlternativeText.qualityEducation'),
      link: '/assets/images/sdgCards/Goal-04.png',
    },
    {
      key: t('infoAndCtaContainer.sdgCardAlternativeText.economicGrowth'),
      link: '/assets/images/sdgCards/Goal-08.png',
    },
    {
      key: t(
        'infoAndCtaContainer.sdgCardAlternativeText.industryInfrastructureAndInnovation'
      ),
      link: '/assets/images/sdgCards/Goal-09.png',
    },
    {
      key: t('infoAndCtaContainer.sdgCardAlternativeText.reducedInequalities'),
      link: '/assets/images/sdgCards/Goal-10.png',
    },
    {
      key: t('infoAndCtaContainer.sdgCardAlternativeText.climateAction'),
      link: '/assets/images/sdgCards/Goal-13.png',
    },
    {
      key: t('infoAndCtaContainer.sdgCardAlternativeText.lifeOnLand'),
      link: '/assets/images/sdgCards/Goal-15.png',
    },
    {
      key: t('infoAndCtaContainer.sdgCardAlternativeText.partnership'),
      link: '/assets/images/sdgCards/Goal-17.png',
    },
  ];

  const sdgCardsDataArray = sdgCardImageLinks.map((item) => (
    <div className={styles.singleSDGCardContainer} key={item.key}>
      <img src={item.link} alt={item.key} />
    </div>
  ));

  return (
    <CarouselSlider
      carouselData={sdgCardsDataArray}
      carouselTitles={{
        primary: t('infoAndCtaContainer.sdgSectionHeadingPrimary'),
        secondary: t('infoAndCtaContainer.sdgSectionHeadingSecondary'),
      }}
      settings={settings}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
      totalSlides={sdgCardImageLinks.length}
    />
  );
};

export default SDGCardList;
