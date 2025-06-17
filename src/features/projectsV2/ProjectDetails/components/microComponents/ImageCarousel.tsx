import type { SliderImage } from '../../../../common/types/projectv2';
import type { SetState } from '../../../../common/types/common';

import React, { useMemo } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../../utils/getImageURL';
import { SingleCarouselImage } from './SingleCarouselImage';
import themeProperties from '../../../../../theme/themeProperties';

interface Props {
  images: SliderImage[] | undefined;
  type: 'coordinate' | 'project';
  imageSize: 'large' | 'medium';
  imageHeight: number;
  isImageModalOpenOnMobile?: boolean;
  currentIndex: number;
  setCurrentIndex: SetState<number>;
  isModalOpen: boolean;
}

const ImageCarousel = ({
  images,
  type,
  imageSize,
  imageHeight,
  isImageModalOpenOnMobile,
  currentIndex,
  setCurrentIndex,
  isModalOpen,
}: Props) => {
  const pattern = /^https:\/\//i;

  const projectImages = useMemo(() => {
    if (images && images?.length > 0) {
      return images
        .map((carouselImage, key) => {
          if (carouselImage?.image) {
            const imageURL = pattern.test(carouselImage.image)
              ? carouselImage.image
              : getImageUrl(type, imageSize, carouselImage.image);
            return {
              content: () => (
                <SingleCarouselImage
                  imageURL={imageURL}
                  imageDescription={carouselImage.description}
                  isImageModalOpenOnMobile={isImageModalOpenOnMobile}
                  isModalOpen={isModalOpen}
                  totalImages={images?.length}
                  currentImage={key + 1}
                />
              ),
            };
          }
          return null;
        })
        .filter(
          (image): image is { content: () => React.ReactElement } =>
            image !== null
        );
    }
    return [];
  }, [type, imageSize, images, isImageModalOpenOnMobile, isModalOpen]);

  if (projectImages?.length === 0) return <></>;
  return (
    <Stories
      stories={projectImages}
      defaultInterval={7000}
      width={'100%'}
      height={imageHeight}
      loop={true}
      progressContainerStyles={
        isModalOpen ? { display: 'none' } : { bottom: '6px', width: '93%' }
      }
      progressStyles={{ background: themeProperties.greenTwo, height: 3.35 }}
      progressWrapperStyles={{
        height: 3.35,
        background: 'rgba(255, 255, 255, 0.50)',
      }}
      currentIndex={currentIndex}
      onStoryStart={(index: number) => setCurrentIndex(index)}
      key={currentIndex}
    />
  );
};

export default ImageCarousel;
