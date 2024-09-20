import React, { ReactElement, useEffect } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import { SliderImage } from '../../../projects/components/PlantLocation/ImageSlider';
import { SingleSliderImage } from './microComponents/SingleSliderImage';
import { PlantLocationCoordinate } from '../../../common/types/plantLocation';

interface Props {
  images: SliderImage[] | PlantLocationCoordinate[] | undefined;
  type: 'coordinate' | 'project';
  imageSize: 'large' | 'medium';
  imageHeight: number;
  leftAlignment?: number;
  hideProgressContainer?: boolean;
}

const ImagesSlider = ({
  images,
  type,
  imageSize,
  imageHeight,
  leftAlignment,
  hideProgressContainer = false,
}: Props) => {
  if (images === undefined) return <></>;
  const [slider, setSlider] = React.useState<ReactElement>();
  const projectImages: { content: () => ReactElement }[] = [];
  const pattern = /^https:\/\//i;
  useEffect(() => {
    images?.forEach((sliderImage) => {
      if (sliderImage.image) {
        let imageURL;
        if (pattern.test(sliderImage.image)) {
          imageURL = sliderImage.image;
        } else {
          imageURL = getImageUrl(type, imageSize, sliderImage.image);
        }
        projectImages.push({
          content: () => (
            <SingleSliderImage
              type={type}
              imageURL={imageURL}
              sliderImage={sliderImage}
            />
          ),
        });
      }
    });
    setSlider(
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

  return <div>{slider}</div>;
};

export default ImagesSlider;
