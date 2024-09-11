import ExpandIcon from '../../../../../../public/assets/images/icons/ExpandIcon';
import ImagesSlider from '../ImagesSlider';
import styles from '../../ProjectDetails.module.scss';
import { useState } from 'react';
import { Modal } from '@mui/material';
import CrossIcon from '../../../../../../public/assets/images/icons/projectV2/CrossIcon';
import { Image } from '@planet-sdk/common';

interface ImageSliderProps {
  images: Image[];
  type: 'coordinate' | 'project';
}
const ImageSlider = ({ images, type }: ImageSliderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {!isModalOpen && (
        <div className={styles.imageSliderContainer}>
          <button onClick={() => setIsModalOpen(true)}>
            <ExpandIcon color="#fff" />
          </button>
          <ImagesSlider
            images={images}
            type={type}
            imageSize={'medium'}
            imageHeight={192}
            leftAlignment={18}
          />
        </div>
      )}
      <Modal
        open={isModalOpen}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className={styles.expandedImageSliderContainer}>
          <button onClick={() => setIsModalOpen(false)}>
            <CrossIcon width={18} />
          </button>
          <ImagesSlider
            images={images}
            type={type}
            imageSize={'large'}
            imageHeight={600}
            leftAlignment={40}
          />
        </div>
      </Modal>
    </>
  );
};

export default ImageSlider;
