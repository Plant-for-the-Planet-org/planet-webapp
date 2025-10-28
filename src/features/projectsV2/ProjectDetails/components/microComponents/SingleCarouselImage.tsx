import clsx from 'clsx';
import styles from '../../styles/Slider.module.scss';

interface Props {
  imageURL: string;
  imageDescription: string | null | undefined;
  isMobile: boolean | undefined;
  isModalOpen: boolean;
  totalImages: number;
  currentImage: number;
}

export const SingleCarouselImage = ({
  imageURL,
  imageDescription,
  isMobile,
  isModalOpen,
  totalImages,
  currentImage,
}: Props) => {
  const isImageModalOpenOnMobile = isModalOpen && isMobile;

  const carouselBackgroundStyle = {
    background: `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${imageURL})`,
  };
  const shouldShowDescription = imageDescription && !isImageModalOpenOnMobile;
  const shouldShowCounter = isModalOpen;

  return (
    <div
      className={clsx('single-carousel-image', styles.singleCarouselImage, {
        [styles.mobileModal]: isImageModalOpenOnMobile,
      })}
      style={carouselBackgroundStyle}
    >
      {shouldShowDescription && (
        <div
          className={clsx('image-description', styles.imageDescription, {
            [styles.modalOpen]: isModalOpen,
          })}
        >
          {imageDescription}
        </div>
      )}
      {shouldShowCounter && (
        <div
          role="status"
          aria-label={`Image ${currentImage} of ${totalImages}`}
        >{`${currentImage} / ${totalImages}`}</div>
      )}
    </div>
  );
};
