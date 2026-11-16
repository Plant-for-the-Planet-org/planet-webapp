import type { SetState } from '../../../../common/types/common';
import type { SliderImage } from './ImageCarousel';

import { Modal } from '@mui/material';
import { useTranslations } from 'next-intl';
import SliderButton from './SliderButton';
import styles from '../../styles/Slider.module.scss';
import CrossIcon from '../../../../../../public/assets/images/icons/projectV2/CrossIcon';
import IconButton from '../../../../common/IconButton';
import ImageCarousel from './ImageCarousel';

interface ImageSliderModalProps {
  currentIndex: number;
  setCurrentIndex: SetState<number>;
  isModalOpen: boolean;
  setIsModalOpen: SetState<boolean>;
  images: SliderImage[];
  isMobile: boolean;
  type: 'coordinate' | 'project';
}

const ImageSliderModal = ({
  currentIndex,
  setCurrentIndex,
  isModalOpen,
  setIsModalOpen,
  images,
  isMobile,
  type,
}: ImageSliderModalProps) => {
  const t = useTranslations('Common');
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

  // The dialog is a single element rather than a fragment, so the modal's focus
  // trap can move focus into it on open and restore it to the trigger on close
  return (
    <Modal
      open={isModalOpen}
      // Only Escape closes: clicking the backdrop did nothing before
      onClose={(_event, reason) => {
        if (reason === 'escapeKeyDown') {
          setIsModalOpen(false);
        }
      }}
    >
      <div
        className={styles.imageSliderDialog}
        role="dialog"
        aria-label={t('imageGallery')}
      >
        {!isMobile && renderSliderButton('prev', styles.sliderButton)}
        <div className={styles.expandedImageSliderContainer}>
          <IconButton
            label={t('close')}
            onClick={() => setIsModalOpen(false)}
            className={styles.closeModalButton}
          >
            <CrossIcon width={isMobile ? 10 : 18} />
          </IconButton>

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
      </div>
    </Modal>
  );
};

export default ImageSliderModal;
