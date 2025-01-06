import type { ReactElement } from 'react';
import type { InnerSlider, Settings } from 'react-slick';

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  CarouselNextIcon,
  CarouselPrevIcon,
} from '../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './CarouselSlider.module.scss';

interface ExtendedInnerSlider extends InnerSlider {
  props: Settings & {
    children: React.ReactNode[]; // Override the type of children in Settings
  };
}

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
  settings: Settings;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  totalSlides: number;
}

const CarouselSlider = ({
  carouselTitle,
  carouselData,
  settings,
  currentSlide,
  setCurrentSlide,
  totalSlides,
}: CarouselSliderProps) => {
  const sliderRef = useRef<Slider | null>(null);
  const [finalSlideStartIndex, setFinalSlideStartIndex] = useState(0);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    let slidesVisibleOnScroll;
    if (screenWidth > 1100) {
      slidesVisibleOnScroll =
        (sliderRef.current?.innerSlider as ExtendedInnerSlider).props?.children
          ?.length || 1;
    } else {
      if (!settings.responsive) return;
      for (const responsiveSetting of settings.responsive) {
        if (screenWidth <= responsiveSetting.breakpoint) {
          slidesVisibleOnScroll = (responsiveSetting.settings as Settings)
            .slidesToShow;
        }
      }
    }
    if (slidesVisibleOnScroll) {
      setFinalSlideStartIndex(totalSlides - slidesVisibleOnScroll);
    }
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const slideCount =
        (slider.innerSlider as ExtendedInnerSlider)?.props.children.length || 0;
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
          <CarouselArrow
            onClick={slideNext}
            direction="next"
            disabled={finalSlideStartIndex == currentSlide}
          />
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {carouselData.map((item) => item)}
      </Slider>
    </div>
  );
};

export default CarouselSlider;
