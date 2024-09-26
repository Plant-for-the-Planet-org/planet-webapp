import React, { ReactElement, useEffect } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import { SliderImage } from '../../../projects/components/PlantLocation/ImageSlider';
import { SingleCarouselImage } from './microComponents/SingleCarouselImage';
import { PlantLocationCoordinate } from '../../../common/types/plantLocation';

interface Props {
  images: SliderImage[] | PlantLocationCoordinate[] | undefined;
  type: 'coordinate' | 'project';
  imageSize: 'large' | 'medium';
  imageHeight: number;
  leftAlignment: number;
  hideProgressContainer?: boolean;
  isImageModalOpenOnMobile?: boolean;
}

const ImageCarousel = ({
  images,
  type,
  imageSize,
  imageHeight,
  leftAlignment,
  isImageModalOpenOnMobile,
  hideProgressContainer,
}: Props) => {
  const [carousel, setCarousel] = React.useState<ReactElement>();
  const projectImages: { content: () => ReactElement }[] = [];
  const pattern = /^https:\/\//i;
  useEffect(() => {
    images?.forEach((carouselImage) => {
      if (carouselImage.image) {
        let imageURL;
        if (pattern.test(carouselImage.image)) {
          imageURL = carouselImage.image;
        } else {
          imageURL = getImageUrl(type, imageSize, carouselImage.image);
        }
        projectImages.push({
          content: () => (
            <SingleCarouselImage
              type={type}
              imageURL={imageURL}
              carouselImage={carouselImage}
              leftAlignment={leftAlignment}
              isImageModalOpenOnMobile={isImageModalOpenOnMobile}
            />
          ),
        });
      }
    });
    setCarousel(
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
          display: hideProgressContainer ? 'none' : 'flex',
        }}
        progressStyles={{ background: '#27AE60', height: 3.35 }}
        progressWrapperStyles={{
          height: 3.35,
          background: 'rgba(255, 255, 255, 0.50)',
        }}
        storyContainerStyles={{ borderRadius: 13 }}
      />
    );
  }, [images]);

  return <>{carousel}</>;
};

export default ImageCarousel;
