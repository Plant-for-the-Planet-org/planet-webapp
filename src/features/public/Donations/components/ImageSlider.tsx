import React from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../../../utils/getImageURL';
import styles from './../styles/ProjectDetails.module.scss';

interface Props {
  project: any;
}

export default function ImageSlider(project: Props) {
  const [slider, setSlider] = React.useState();
  let projectImages: { content: () => JSX.Element }[] = [];

  const loadImageSource = (image: any) => {
    const ImageSource = getImageUrl('project', 'medium', image);
    return ImageSource;
  };

  React.useEffect(() => {
    project.project.images.forEach((image: any) => {
      let imageURL = loadImageSource(image.image);
      projectImages.push({
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
    });
  }, [project]);
  React.useEffect(() => {
    setSlider(
      <Stories
        stories={projectImages}
        defaultInterval={7000}
        width="100%"
        height={233}
        loop={true}
      />
    );
  }, []);
  return <>{slider}</>;
}
