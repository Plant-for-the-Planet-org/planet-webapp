import type { Image } from '../../../common/types/projectv2';

import ExpandIcon from '../../../../../public/assets/images/icons/ExpandIcon';
import ImageCarousel from './microComponents/ImageCarousel';
import styles from '../styles/Slider.module.scss';
import { useState } from 'react';
import ImageSliderModal from './microComponents/ImageSliderModal';

interface ImageSliderProps {
  images: Image[];
  type: 'coordinate' | 'project';
  isMobile: boolean;
  imageSize: 'medium' | 'large';
  allowFullView?: boolean;
}

const ImageSlider = ({
  images,
  imageSize,
  type,
  isMobile,
  allowFullView = true,
}: ImageSliderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      {!isModalOpen && (
        <div
          className={`image-slider-container ${styles.imageSliderContainer}`}
        >
          {allowFullView && (
            <button onClick={() => setIsModalOpen(true)}>
              <ExpandIcon color="#fff" />
            </button>
          )}
          <ImageCarousel
            images={images}
            type={type}
            imageSize={imageSize}
            imageHeight={192}
            setCurrentIndex={setCurrentIndex}
            currentIndex={currentIndex}
            isModalOpen={isModalOpen}
          />
        </div>
      )}
      {allowFullView && (
        <ImageSliderModal
          currentIndex={currentIndex}
          images={images}
          setCurrentIndex={setCurrentIndex}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isMobile={isMobile}
          type={type}
        />
      )}
    </>
  );
};

export default ImageSlider;
