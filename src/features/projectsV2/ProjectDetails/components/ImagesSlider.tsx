import React, { ReactElement, useEffect } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import { SliderImage } from '../../../projects/components/PlantLocation/ImageSlider';
import { SingleSliderImage } from './microComponents/SingleSliderImage';
import styles from '../styles/Slider.module.scss';

interface Props {
  images: SliderImage[];
  type: 'coordinate' | 'project';
}

const ImagesSlider = ({ images, type }: Props) => {
  const [slider, setSlider] = React.useState<ReactElement>();
  const projectImages: { content: () => ReactElement }[] = [];
  const pattern = /^https:\/\//i;
  useEffect(() => {
    images.forEach((sliderImage) => {
      if (sliderImage.image) {
        let imageURL;
        if (pattern.test(sliderImage.image)) {
          imageURL = sliderImage.image;
        } else {
          imageURL = getImageUrl(type, 'medium', sliderImage.image);
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
        height={192}
        loop={true}
        progressContainerStyles={{
          position: 'absolute',
          bottom: 18,
          right: 18,
          left: 18,
          padding: '7px 0 5px 0',
          maxWidth: '90%',
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
