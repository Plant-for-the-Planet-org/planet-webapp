import React, { ReactElement } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './../../styles/PlantLocation.module.scss';

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
  const [slider, setSlider] = React.useState<ReactElement>();
  const projectImages: { content: () => ReactElement }[] = [];

  const loadImageSource = (imageName: string): string => {
    const ImageSource = getImageUrl(type, imageSize, imageName);
    return ImageSource;
  };

  React.useEffect(() => {
    images.forEach((sliderImage) => {
      if (sliderImage.image) {
        const imageURL = loadImageSource(sliderImage.image);
        projectImages.push({
          content: () => (
            <div
              className={styles.projectImageSliderContent}
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${imageURL})`,
              }}
            >
              <p className={styles.projectImageSliderContentText}>
                {sliderImage.description}
              </p>
            </div>
          ),
        });
      }
      setSlider(
        <Stories
          stories={projectImages}
          defaultInterval={7000}
          width="100%"
          height={height}
          loop={true}
        />
      )
    });
  }, [images]);

  return <>{slider}</>;
}
