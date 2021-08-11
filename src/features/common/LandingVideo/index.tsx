import React, { ReactElement } from 'react';
import styles from './styles.module.scss';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

interface Props {
  setshowVideo: Function;
}

function VideoContainer({ setshowVideo }: Props): ReactElement {
  const { t, ready, i18n } = useTranslation(['common']);
  const [videoURL, setvideoURL] = React.useState<null | string>(null);
  const [isUploading, setisUploading] = React.useState(false);
  const handleVideoClose = () => {
    setshowVideo(false);
    setisUploading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hidePreview', true);
    }
  };

  React.useEffect(() => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      switch (localStorage.getItem('language')) {
        case 'de':
          setvideoURL(
            `https://a.plant-for-the-planet.org/wp-content/videos/en-intro-mobile-planet.mp4`
          );
          break;
        case 'en':
          setvideoURL(
            `https://a.plant-for-the-planet.org/wp-content/videos/en-intro-mobile-planet.mp4`
          );
          break;
        default:
          setvideoURL(
            `https://a.plant-for-the-planet.org/wp-content/videos/en-intro-mobile-planet.mp4`
          );
      }
    } else {
      switch (localStorage.getItem('language')) {
        case 'de':
          setvideoURL(
            `https://a.plant-for-the-planet.org/wp-content/videos/en-intro-web-planet.mp4`
          );
          break;
        case 'en':
          setvideoURL(
            `https://a.plant-for-the-planet.org/wp-content/videos/en-intro-web-planet.mp4`
          );
          break;
        default:
          setvideoURL(
            `https://a.plant-for-the-planet.org/wp-content/videos/en-intro-web-planet.mp4`
          );
      }
    }
  }, []);
  return ready ? (
    <div className={styles.landingVideoSection}>
      <div className={styles.landingVideoWrapper}>
        {videoURL && (
          <video
            preload={'auto'}
            muted
            autoPlay
            playsInline
            onEnded={() => handleVideoClose()}
          >
            <source src={videoURL} type="video/mp4" />
          </video>
        )}
      </div>
      <button
        id="skipLandingVideo"
        className={styles.landingVideoSkipButton}
        onClick={() => handleVideoClose()}
      >
        {isUploading ? (
          <div className={styles.spinner}></div>
        ) : (
          t('common:skipIntroVideo')
        )}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default VideoContainer;
