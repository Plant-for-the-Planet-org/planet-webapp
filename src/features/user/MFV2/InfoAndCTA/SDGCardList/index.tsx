import React, { useState } from 'react';
import CustomControlledCarousel from '../../../../common/CustomControlledCarousel';
import { useTranslations } from 'next-intl';
import SDGElements from './SDGCardsData';

const SDGCardList = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('Profile');
  const settings = {
    infinite: true,
    slidesToShow: 9,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlide(current),
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: 8,
        },
      },
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

  const sdgCardsDataArray = SDGElements();

  return (
    <CustomControlledCarousel
      carouselData={sdgCardsDataArray}
      carouselTitle={t('infoAndCtaContainer.sdgCardsSectionHeading')}
      settings={settings}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
};

export default SDGCardList;
