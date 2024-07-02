import React, { useState } from 'react';
import CustomControlledCarousel from '../../../../common/CustomControlledCarousel';
import sdgElements from './SDGCardsData';

const SDGCardList = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlide(current),
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
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
        breakpoint: 460,
        settings: {
          centerMode: false,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <CustomControlledCarousel
      carouselData={sdgElements}
      carouselTitle={
        'Restoring Ecosystems & Fighting the Climate Crisis for the SDGs'
      }
      settings={settings}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
};

export default SDGCardList;
