import React, { ReactElement, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  CarouselNextIcon,
  CarouselPrevIcon,
} from '../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './CarouselSlider.module.scss';

const CarouselArrow = (props: {
  onClick: () => void;
  disabled?: boolean;
  direction: string;
}) => {
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

interface CarouselSliderProps {
  carouselTitle: string;
  carouselData: ReactElement[];
  settings: any;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const CarouselSlider = ({
  carouselTitle,
  carouselData,
  settings,
  currentSlide,
  setCurrentSlide,
}: CarouselSliderProps) => {
  const sliderRef = useRef<Slider | null>(null);

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
    <div className={styles.carouselSliderContainer}>
      <div className={styles.carouselHeader}>
        <div className={styles.titleContainer}>
          <h2>{carouselTitle}</h2>
        </div>
        <div className={styles.arrowContainer}>
          <CarouselArrow
            onClick={slidePrev}
            disabled={currentSlide === 0}
            direction="prev"
          />
          <CarouselArrow onClick={slideNext} direction="next" />
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {carouselData.map((item) => item)}
      </Slider>
    </div>
  );
};

export default CarouselSlider;
