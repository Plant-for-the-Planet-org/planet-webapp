import React, { ReactElement } from 'react';
import styles from '../../styles/PlantLocation.module.scss';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';

interface Props {
  images: any;
  height: any;
  imageSize: any;
}

export default function ImageSlider({ images, height, imageSize }: Props) {
  const [slider, setSlider] = React.useState<JSX.Element>();
  const [projectImages, setProjectImages] = React.useState([]);

  const loadImageSource = (image: any) => {
    const ImageSource = getImageUrl('coordinate', imageSize, image);
    return ImageSource;
  };

  React.useEffect(() => {
    const sliderImages = [];
    if (images) {
      images.forEach((image: any) => {
        if (image.image) {
          const imageURL = loadImageSource(image.image);
          sliderImages.push({
            content: () => (
              <div
                className={styles.projectImageSliderContent}
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${imageURL})`,
                }}
              >
                <p className={styles.projectImageSliderContentText}>
                  {image.description}
                </p>
              </div>
            ),
          });
        }
      });
      setProjectImages(sliderImages);
    } else {
      setProjectImages([]);
    }
  }, [images]);

  React.useEffect(() => {
    if (projectImages.length !== 0) {
      setSlider(
        <Stories
          stories={projectImages}
          defaultInterval={7000}
          width="100%"
          height={height}
          loop={true}
        />
      );
    } else {
      setSlider(<></>);
    }
  }, [projectImages]);
  return <>{slider}</>;
}
