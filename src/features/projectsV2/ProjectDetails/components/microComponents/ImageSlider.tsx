import type { Image } from '../../../../common/types/projectv2';

import ExpandIcon from '../../../../../../public/assets/images/icons/ExpandIcon';
import ImageCarousel from '../ImageCarousel';
import styles from '../../styles/Slider.module.scss';
import { useState } from 'react';
import { Modal } from '@mui/material';
import CrossIcon from '../../../../../../public/assets/images/icons/projectV2/CrossIcon';

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
  const isImageModalOpenOnMobile = isModalOpen && isMobile;
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
            leftAlignment={18}
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
          }}
        >
          <div className={styles.expandedImageSliderContainer}>
            {
              <button onClick={() => setIsModalOpen(false)}>
                <CrossIcon width={18} />
              </button>
            }
            <ImageCarousel
              images={images}
              type={type}
              imageSize={'large'}
              imageHeight={600}
              leftAlignment={isMobile ? 14 : 40}
              isImageModalOpenOnMobile={isImageModalOpenOnMobile}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ImageSlider;
