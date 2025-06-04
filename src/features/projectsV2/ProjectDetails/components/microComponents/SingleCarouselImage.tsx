import styles from '../../styles/Slider.module.scss';

interface Props {
  imageURL: string;
  imageDescription: string | null | undefined;
  isImageModalOpenOnMobile: boolean | undefined;
  isModalOpen: boolean;
  totalImages: number;
  currentImage: number;
}

export const SingleCarouselImage = ({
  imageURL,
  imageDescription,
  isImageModalOpenOnMobile,
  isModalOpen,
  totalImages,
  currentImage,
}: Props) => {
  return (
    <div
      className={
        isImageModalOpenOnMobile
          ? styles.carouselContentMobile
          : styles.carouselContent
      }
      style={{
        background: `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${imageURL})`,
      }}
    >
      {imageDescription && !isImageModalOpenOnMobile && (
        <p>{imageDescription}</p>
      )}
      {isModalOpen && <p>{`${currentImage} / ${totalImages}`}</p>}
    </div>
  );
};
