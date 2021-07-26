import React from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './../../styles/PlantLocation.module.scss';

interface Props {
  images: any;
  height: any;
  imageSize: any;
  type: string;
}

export default function ImageSlider({
  images,
  height,
  imageSize,
  type,
}: Props) {
  const [slider, setSlider] = React.useState<JSX.Element>();
  const projectImages: { content: () => JSX.Element }[] = [];

  const loadImageSource = (image: any) => {
    const ImageSource = getImageUrl(type, imageSize, image);
    return ImageSource;
  };

  React.useEffect(() => {
    images.forEach((image: any) => {
      const imageURL = loadImageSource(image.image);
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
              {image.description}
            </p>
          </div>
        ),
      });
    });
  }, [images]);

  React.useEffect(() => {
    setSlider(
      <Stories
        stories={projectImages}
        defaultInterval={7000}
        width="100%"
        height={height}
        loop={true}
      />
    );
  }, []);
  return <>{slider}</>;
}
