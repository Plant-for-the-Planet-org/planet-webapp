import { SliderImage } from '../../../../projects/components/PlantLocation/ImageSlider';
import styles from '../../styles/Slider.module.scss';

interface Props {
  type: string;
  imageURL: string;
  sliderImage: SliderImage;
}

export const SingleSliderImage = ({ type, imageURL, sliderImage }: Props) => {
  return (
    <div
      className={styles.sliderContent}
      style={
        type === 'coordinate'
          ? { background: `url(${imageURL})` }
          : {
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.49) 100%),url(${imageURL})`,
            }
      }
    >
      <p className={styles.sliderContentText}>{sliderImage.description}</p>
    </div>
  );
};
