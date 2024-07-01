import React, { useEffect, useRef, useState } from 'react';
import styles from '../InfoAndCta.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  CarouselNextIcon,
  CarouselPrevIcon,
} from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';

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

// const SDGCardList = () => {
//   const sliderRef = useRef(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   // const [slideCount, setSlideCount] = useState(17);
//   const settings = {
//     dots: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     infinite: true,
//     arrows: true,
//     // nextArrow: <SampleNextArrow />,
//     // prevArrow: <SamplePrevArrow />,
//   };
//   return (
//     <div className={styles.container}>
//       <h2>Restoring Ecosystems & Fighting the Climate Crisis for the SDGs</h2>
//       <div className={styles.cardListCarouselArrowContainer}>
//         <SampleArrow
//           // onClick={() => sliderRef.current.slickPrev()}
//           // disabled={sliderRef.current?.innerSlider?.state.currentSlide === 0}
//           onClick={() => setCurrentSlide(currentSlide - 1)}
//           disabled={currentSlide === 0}
//           direction="prev"
//         />
//         <SampleArrow
//           onClick={() => setCurrentSlide(currentSlide + 1)}
//           disabled={currentSlide === 3}
//           direction="next"
//         />
//       </div>
//       <Slider {...settings} ref={sliderRef}>
//         <div>
//           <h3>FIRST SLIDE</h3>
//         </div>
//         <div>
//           <h3>SECOND SLIDE</h3>
//         </div>
//         <div>
//           <h3>THIRD SLIDE</h3>
//         </div>
//         <div>
//           <h3>FORTH SLIDE</h3>
//         </div>
//       </Slider>
//     </div>
//   );
// };

// const SampleArrow = ({ onClick, disabled, direction }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     style={{
//       background: disabled ? 'gray' : 'blue',
//       border: 'none',
//       cursor: disabled ? 'not-allowed' : 'pointer',
//       margin: '0 5px',
//     }}
//   >
//     {direction === 'next' ? '→' : '←'}
//   </button>
// );

const CustomControlledCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlide(current),
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
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
      >
        <h2 style={{ marginRight: '10px' }}>
          Restoring Ecosystems & Fighting the Climate Crisis for the SDGs
        </h2>
        <SampleArrow
          onClick={slidePrev}
          disabled={currentSlide === 0}
          direction="prev"
        />
        <SampleArrow
          onClick={slideNext}
          // to fix
          disabled={
            sliderRef.current?.innerSlider?.state.currentSlide >=
            sliderRef.current?.innerSlider?.state.slideCount - 1
          }
          direction="next"
        />
      </div>
      <Slider ref={sliderRef} {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider>
    </div>
  );
};

export default CustomControlledCarousel;
