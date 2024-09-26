import { useMemo } from 'react';
import { SliderImage } from '../../../../projects/components/PlantLocation/ImageSlider';
import styles from '../../styles/Slider.module.scss';

interface Props {
  type: string;
  imageURL: string;
  carouselImage: SliderImage;
  leftAlignment: number;
  isImageModalOpenOnMobile: boolean | undefined;
}

const getBackgroundStyle = (type: string, imageUrl: string) =>
  type === 'coordinate'
    ? { background: `url(${imageUrl})` }
    : {
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.49) 100%), url(${imageUrl})`,
      };

export const SingleCarouselImage = ({
  type,
  imageURL,
  carouselImage,
  leftAlignment,
  isImageModalOpenOnMobile,
}: Props) => {
  const backgroundStyle = useMemo(
    () => getBackgroundStyle(type, imageURL),
    [type, imageURL]
  );
  const contentClassName = `${styles.carouselContent} ${
    isImageModalOpenOnMobile ? styles.carouselContentExpand : ''
  }`;
  return (
    <div className={contentClassName} style={backgroundStyle}>
      <p
        className={styles.carouselContentText}
        style={{ left: `${leftAlignment}px` }}
      >
        {carouselImage?.description}
      </p>
    </div>
  );
};
