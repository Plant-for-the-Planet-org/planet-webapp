import { SliderImage } from '../../../../projects/components/PlantLocation/ImageSlider';
import styles from '../../styles/Slider.module.scss';

interface Props {
  type: string;
  imageURL: string;
  carouselImage: SliderImage;
  leftAlignment: number;
}

export const SingleCarouselImage = ({
  type,
  imageURL,
  carouselImage,
  leftAlignment,
}: Props) => {
  return (
    <div
      className={styles.carouselContent}
      style={
        type === 'coordinate'
          ? { background: `url(${imageURL})` }
          : {
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.49) 100%),url(${imageURL})`,
            }
      }
    >
      <p
        className={styles.carouselContentText}
        style={{ left: `${leftAlignment}px` }}
      >
        {carouselImage?.description}
      </p>
    </div>
  );
};
