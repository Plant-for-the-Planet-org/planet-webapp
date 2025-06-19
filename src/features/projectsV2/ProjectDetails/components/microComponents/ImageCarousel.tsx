import type { SliderImage } from '../../../../common/types/projectv2';
import type { SetState } from '../../../../common/types/common';

import React, { useMemo } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../../utils/getImageURL';
import { SingleCarouselImage } from './SingleCarouselImage';
import themeProperties from '../../../../../theme/themeProperties';

const HTTPS_PATTERN = /^https:\/\//i;

const PROGRESS_STYLES = {
  HEIGHT: 3.35,
  BOTTOM_POSITION: '6px',
  WIDTH: '93%',
  BACKGROUND_OPACITY: 'rgba(255, 255, 255, 0.50)',
} as const;

const progressStyles = {
  background: themeProperties.greenTwo,
  height: PROGRESS_STYLES.HEIGHT,
};

const progressWrapperStyles = {
  height: PROGRESS_STYLES.HEIGHT,
  background: PROGRESS_STYLES.BACKGROUND_OPACITY,
};
interface Props {
  images: SliderImage[] | undefined;
  type: 'coordinate' | 'project';
  imageSize: 'large' | 'medium';
  imageHeight: number;
  isMobile?: boolean;
  currentIndex: number;
  setCurrentIndex: SetState<number>;
  isModalOpen: boolean;
}

const ImageCarousel = ({
  images,
  type,
  imageSize,
  imageHeight,
  isMobile,
  currentIndex,
  setCurrentIndex,
  isModalOpen,
}: Props) => {
  const progressContainerStyles = useMemo(
    () =>
      isModalOpen
        ? { display: 'none' }
        : {
            bottom: PROGRESS_STYLES.BOTTOM_POSITION,
            width: PROGRESS_STYLES.WIDTH,
          },
    [isModalOpen]
  );

  const processedImages = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }

    return images
      .map((carouselImage, index) => {
        if (!carouselImage?.image) return null;

        // Determine image URL
        const imageURL = HTTPS_PATTERN.test(carouselImage.image)
          ? carouselImage.image
          : getImageUrl(type, imageSize, carouselImage.image);

        return {
          imageURL,
          description: carouselImage.description,
          imageIndex: index,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [images, type, imageSize]);

  const storiesData = useMemo(() => {
    return processedImages.map(({ imageURL, description, imageIndex }) => ({
      content: () => (
        <SingleCarouselImage
          imageURL={imageURL}
          imageDescription={description}
          isMobile={isMobile}
          isModalOpen={isModalOpen}
          totalImages={processedImages.length}
          currentImage={imageIndex + 1}
        />
      ),
    }));
  }, [processedImages, isMobile, isModalOpen]);

  return (
    <Stories
      stories={storiesData}
      defaultInterval={7000}
      width={'100%'}
      height={imageHeight}
      loop={true}
      progressContainerStyles={progressContainerStyles}
      progressStyles={progressStyles}
      progressWrapperStyles={progressWrapperStyles}
      currentIndex={currentIndex}
      onStoryStart={(index: number) => setCurrentIndex(index)}
    />
  );
};

export default ImageCarousel;
