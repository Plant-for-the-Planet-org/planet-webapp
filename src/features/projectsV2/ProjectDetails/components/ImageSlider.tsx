import type { SliderImage } from './microComponents/ImageCarousel';

import ExpandIcon from '../../../../../public/assets/images/icons/ExpandIcon';
import ImageCarousel from './microComponents/ImageCarousel';
import styles from '../styles/Slider.module.scss';
import { useState, useMemo } from 'react';
import ImageSliderModal from './microComponents/ImageSliderModal';
import themeProperties from '../../../../theme/themeProperties';

interface ImageSliderProps {
  images: SliderImage[];
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

  // Filter out images with empty or missing image property
  const validImages = useMemo(() => {
    return images.filter((image) => image?.image && image.image.trim() !== '');
  }, [images]);

  // Don't render if no valid images
  if (validImages.length === 0) {
    return null;
  }

  return (
    <>
      {!isModalOpen && (
        <div
          className={`image-slider-container ${styles.imageSliderContainer}`}
        >
          {allowFullView && (
            <button onClick={() => setIsModalOpen(true)}>
              <ExpandIcon color={themeProperties.designSystem.colors.white} />
            </button>
          )}
          <ImageCarousel
            images={validImages}
            type={type}
            imageSize={imageSize}
            imageHeight={192}
            isMobile={isMobile}
            isModalOpen={false}
            mode="auto"
          />
        </div>
      )}
      {allowFullView && (
        <ImageSliderModal
          currentIndex={currentIndex}
          images={validImages}
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
