import { SliderImage } from '../../../../projects/components/PlantLocation/ImageSlider';
import styles from '../../styles/Slider.module.scss';

interface Props {
  imageURL: string;
  sliderImage: SliderImage;
}

export const SingleSliderImage = ({ imageURL, sliderImage }: Props) => {
  return (
    <div
      className={styles.sliderContent}
      style={{
        background: `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${imageURL})`,
      }}
    >
      <p className={styles.sliderContentText}>{sliderImage.description}</p>
    </div>
  );
};
