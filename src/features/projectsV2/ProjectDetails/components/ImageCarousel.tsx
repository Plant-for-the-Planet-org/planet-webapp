import type { SliderImage } from '../../../common/types/projectv2';

import React, { useEffect, useState } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import { SingleCarouselImage } from './microComponents/SingleCarouselImage';

interface Props {
  images: SliderImage[] | undefined;
  type: 'coordinate' | 'project';
  imageSize: 'large' | 'medium';
  imageHeight: number;
  leftAlignment: number;
  isImageModalOpenOnMobile?: boolean;
}

const ImageCarousel = ({
  images,
  type,
  imageSize,
  imageHeight,
  leftAlignment,
  isImageModalOpenOnMobile,
}: Props) => {
  const [projectImages, setProjectImages] = useState<
    {
      content: () => React.ReactElement;
    }[]
  >([]);
  const pattern = /^https:\/\//i;
  useEffect(() => {
    if (images && images?.length > 0) {
      const result = images
        .map((carouselImage) => {
          if (carouselImage?.image) {
            const imageURL = pattern.test(carouselImage.image)
              ? carouselImage.image
              : getImageUrl(type, imageSize, carouselImage.image);
            return {
              content: () => (
                <SingleCarouselImage
                  imageURL={imageURL}
                  carouselImage={carouselImage}
                  leftAlignment={leftAlignment}
                  isImageModalOpenOnMobile={isImageModalOpenOnMobile}
                />
              ),
            };
          }
          return null;
        })
        .filter((image) => image !== null && image !== undefined);
      setProjectImages(result);
    }
  }, [images]);

  if (projectImages?.length === 0) return <></>;
  return (
    <Stories
      stories={projectImages}
      defaultInterval={7000}
      width={'100%'}
      height={imageHeight}
      loop={true}
      progressContainerStyles={{
        position: 'absolute',
        bottom: 18,
        right: 18,
        left: leftAlignment,
        padding: '7px 0 5px 0',
        maxWidth: '90%',
      }}
      progressStyles={{ background: '#27AE60', height: 3.35 }}
      progressWrapperStyles={{
        height: 3.35,
        background: 'rgba(255, 255, 255, 0.50)',
      }}
      // storyContainerStyles={{ borderRadius: 13 }}
    />
  );
};

export default ImageCarousel;
