import { SliderImage } from '../../../../common/types/projectv2';
import styles from '../../styles/Slider.module.scss';

interface Props {
  imageURL: string;
  carouselImage: SliderImage;
  leftAlignment: number;
  isImageModalOpenOnMobile: boolean | undefined;
}

export const SingleCarouselImage = ({
  imageURL,
  carouselImage,
  leftAlignment,
  isImageModalOpenOnMobile,
}: Props) => {
  const contentClassName = `${styles.carouselContent} ${
    isImageModalOpenOnMobile ? styles.carouselContentExpand : ''
  }`;
  return (
    <div
      className={contentClassName}
      style={{
        background: `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${imageURL})`,
      }}
    >
      {carouselImage?.description && (
        <p
          className={styles.carouselContentText}
          style={{ left: `${leftAlignment}px` }}
        >
          {carouselImage?.description}
        </p>
      )}
    </div>
  );
};
