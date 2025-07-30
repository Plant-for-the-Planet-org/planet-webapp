import type { SliderImage } from '../../../../common/types/projectv2';
import type { SetState } from '../../../../common/types/common';

import React, { useMemo } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../../utils/getImageURL';
import { SingleCarouselImage } from './SingleCarouselImage';
import themeProperties from '../../../../../theme/themeProperties';

const { colors } = themeProperties.designSystem;

const HTTPS_PATTERN = /^https:\/\//i;

const PROGRESS_STYLES = {
  HEIGHT: 3.35,
  BOTTOM_POSITION: '6px',
  WIDTH: '93%',
  BACKGROUND_OPACITY: colors.mediumGreyTransparent70,
} as const;

const progressStyles = {
  background: colors.leafGreen,
  height: PROGRESS_STYLES.HEIGHT,
};

const progressWrapperStyles = {
  height: PROGRESS_STYLES.HEIGHT,
  background: PROGRESS_STYLES.BACKGROUND_OPACITY,
};

interface BaseProps {
  images: SliderImage[] | undefined;
  type: 'coordinate' | 'project';
  imageSize: 'large' | 'medium';
  imageHeight: number;
  isMobile?: boolean;
  isModalOpen: boolean;
}

interface AutoModeProps extends BaseProps {
  mode: 'auto';
}

interface ManualModeProps extends BaseProps {
  mode: 'manual';
  currentIndex: number;
  setCurrentIndex: SetState<number>;
}

type CarouselProps = AutoModeProps | ManualModeProps;

const ImageCarousel = (props: CarouselProps) => {
  const { images, type, imageSize, imageHeight, isMobile, isModalOpen, mode } =
    props;

  const isManual = mode === 'manual';
  const currentIndex = isManual ? props.currentIndex : 0;
  const setCurrentIndex = isManual ? props.setCurrentIndex : undefined;

  const progressContainerStyles = useMemo(() => {
    if (isModalOpen) {
      return { display: 'none' };
    }
    return {
      bottom: PROGRESS_STYLES.BOTTOM_POSITION,
      width: PROGRESS_STYLES.WIDTH,
    };
  }, [isModalOpen]);

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

  const storiesProps = {
    stories: storiesData,
    width: '100%' as const,
    height: imageHeight,
    progressContainerStyles,
    progressStyles,
    progressWrapperStyles,
  };

  if (isManual) {
    return (
      <Stories
        {...storiesProps}
        defaultInterval={999999999}
        loop={false}
        currentIndex={currentIndex}
        onStoryStart={(index: number) => setCurrentIndex?.(index)}
      />
    );
  }

  return <Stories {...storiesProps} defaultInterval={7000} loop={true} />;
};

export default ImageCarousel;
