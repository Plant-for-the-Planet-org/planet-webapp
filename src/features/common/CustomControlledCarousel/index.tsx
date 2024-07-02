import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  CarouselNextIcon,
  CarouselPrevIcon,
} from '../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './CustomCarousel.module.scss';

const SampleArrow = (props) => {
  const { onClick, disabled, direction } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? 'none' : 'pointer',
      }}
    >
      {direction === 'next' ? (
        <CarouselNextIcon color={disabled ? '#E0E0E0' : '#007A49'} />
      ) : (
        <CarouselPrevIcon color={disabled ? '#E0E0E0' : '#007A49'} />
      )}
    </button>
  );
};

interface CustomControlledCarouselProps {
  carouselTitle: string;
  carouselData: ReactElement[];
}

const CustomControlledCarousel = ({
  carouselTitle,
  carouselData,
}: CustomControlledCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

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
        breakpoint: 430,
        settings: {
          centerMode: false,
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const slideCount = slider.innerSlider.props.children.length;
      if (currentSlide >= slideCount - 1) {
        setCurrentSlide(slideCount - 1);
      }
    }
  }, [currentSlide]);

  const slideNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const slidePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <div className={styles.customCarouselContainer}>
      <div className={styles.carouselHeader}>
        <div className={styles.titleContainer}>
          <h2>{carouselTitle}</h2>
        </div>
        <div className={styles.arrowContainer}>
          <SampleArrow
            onClick={slidePrev}
            disabled={currentSlide === 0}
            direction="prev"
          />
          <SampleArrow onClick={slideNext} direction="next" />
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {carouselData.map((item) => item)}
      </Slider>
    </div>
  );
};

export default CustomControlledCarousel;
