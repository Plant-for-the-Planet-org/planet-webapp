import type { Image } from '../../../../common/types/projectv2';

import ExpandIcon from '../../../../../../public/assets/images/icons/ExpandIcon';
import ImageCarousel from '../ImageCarousel';
import styles from '../../styles/Slider.module.scss';
import { useState } from 'react';
import { Modal } from '@mui/material';
import CrossIcon from '../../../../../../public/assets/images/icons/projectV2/CrossIcon';
import SliderButton from './SliderButton';

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
  const isImageModalOpenOnMobile = isModalOpen && isMobile;
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === images.length - 1;

  const renderSliderButton = (dir: 'prev' | 'next', className: string) => (
    <SliderButton
      direction={dir}
      disabled={dir === 'prev' ? isFirstImage : isLastImage}
      onClick={() => setCurrentIndex(currentIndex + (dir === 'prev' ? -1 : 1))}
      className={className}
    />
  );
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
        <Modal
          open={isModalOpen}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            gap: '20px',
          }}
        >
          <>
            {!isMobile && renderSliderButton('prev', styles.sliderButton)}
            <div className={styles.expandedImageSliderContainer}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.closeModalButton}
              >
                <CrossIcon width={isMobile ? 10 : 18} />
              </button>

              {isMobile &&
                renderSliderButton('prev', styles.prevMobileSliderButton)}

              <ImageCarousel
                images={images}
                type={type}
                imageSize={'large'}
                imageHeight={isMobile ? 220 : 600}
                isImageModalOpenOnMobile={isImageModalOpenOnMobile}
                setCurrentIndex={setCurrentIndex}
                currentIndex={currentIndex}
                isModalOpen={isModalOpen}
              />
              {isMobile &&
                renderSliderButton('next', styles.nextMobileSliderButton)}
            </div>
            {!isMobile && renderSliderButton('next', styles.sliderButton)}
          </>
        </Modal>
      )}
    </>
  );
};

export default ImageSlider;
