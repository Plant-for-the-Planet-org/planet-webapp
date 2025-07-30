import type { SetState } from '../../../../common/types/common';
import type { Image } from '@planet-sdk/common';

import { Modal } from '@mui/material';
import SliderButton from './SliderButton';
import styles from '../../styles/Slider.module.scss';
import CrossIcon from '../../../../../../public/assets/images/icons/projectV2/CrossIcon';
import ImageCarousel from './ImageCarousel';

interface ImageSliderModalProps {
  currentIndex: number;
  setCurrentIndex: SetState<number>;
  isModalOpen: boolean;
  setIsModalOpen: SetState<boolean>;
  images: Image[];
  isMobile: boolean;
  type: 'coordinate' | 'project';
}

const modalContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  gap: '20px',
};

const ImageSliderModal = ({
  currentIndex,
  setCurrentIndex,
  isModalOpen,
  setIsModalOpen,
  images,
  isMobile,
  type,
}: ImageSliderModalProps) => {
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === images.length - 1;

  const renderSliderButton = (dir: 'prev' | 'next', className: string) => (
    <SliderButton
      direction={dir}
      disabled={
        (dir === 'prev' && isFirstImage) || (dir === 'next' && isLastImage)
      }
      onClick={() => setCurrentIndex(currentIndex + (dir === 'prev' ? -1 : 1))}
      className={className}
    />
  );

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      sx={modalContainerStyles}
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
            isMobile={isMobile}
            isModalOpen={true}
            mode="manual"
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
          {isMobile &&
            renderSliderButton('next', styles.nextMobileSliderButton)}
        </div>
        {!isMobile && renderSliderButton('next', styles.sliderButton)}
      </>
    </Modal>
  );
};

export default ImageSliderModal;
