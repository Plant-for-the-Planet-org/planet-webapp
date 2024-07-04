import React, { useState } from 'react';
import CarouselSlider from '../../../../common/CarouselSlider';
import { useTranslations } from 'next-intl';
import styles from '../InfoAndCta.module.scss';

const SDGCardList = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('Profile');
  const settings = {
    infinite: false,
    slidesToShow: 8,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlide(current),
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1230,
        settings: {
          slidesToShow: 7,
        },
      },
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
    '/assets/images/sdgCards/Goal-04.png',
    '/assets/images/sdgCards/Goal-08.png',
    '/assets/images/sdgCards/Goal-09.png',
    '/assets/images/sdgCards/Goal-10.png',
    '/assets/images/sdgCards/Goal-13.png',
    '/assets/images/sdgCards/Goal-15.png',
    '/assets/images/sdgCards/Goal-17.png',
  ];

  const sdgCardsDataArray = sdgCardImageLinks.map((item, index) => (
    <div className={styles.singleSDGCardContainer} key={index}>
      <img src={item} alt="SDG card" />
    </div>
  ));

  return (
    <CarouselSlider
      carouselData={sdgCardsDataArray}
      carouselTitle={t('infoAndCtaContainer.sdgCardsSectionHeading')}
      settings={settings}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
};

export default SDGCardList;
