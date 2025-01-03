import type { Story } from 'react-insta-stories/dist/interfaces';

import { useState, useEffect } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './../../styles/ProjectDetails.module.scss';

export type SliderImage = {
  image?: string;
  description?: string | null;
};

interface Props {
  images: SliderImage[];
  height: number | string;
  imageSize: string;
  type: string;
}

export default function ImageSlider({
  images,
  height,
  imageSize,
  type,
}: Props) {
  const [slider, setSlider] = useState<Story[]>([]);

  const loadImageSource = (imageName: string): string => {
    const ImageSource = getImageUrl(type, imageSize, imageName);
    return ImageSource;
  };

  const setupSlider = () => {
    const projectImages: Story[] = [];
    images.forEach((sliderImage) => {
      if (sliderImage.image) {
        const imageURL = loadImageSource(sliderImage.image);
        projectImages.push({
          content: () => (
            <div
              className={styles.projectImageSliderContent}
              style={
                type === 'coordinate'
                  ? { background: `url(${imageURL})` }
                  : {
                      background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${imageURL})`,
                    }
              }
            >
              <p className={styles.projectImageSliderContentText}>
                {sliderImage.description}
              </p>
            </div>
          ),
        });
      }
    });
    setSlider(projectImages);
  };

  useEffect(() => {
    if (images.length > 0) {
      setupSlider();
    }
  }, [images]);

  if (slider.length === 0) {
    return null;
  }

  return (
    <Stories
      stories={slider}
      defaultInterval={7000}
      width="100%"
      height={height}
      loop={true}
    />
  );
}
