import type { ReactElement } from 'react';

import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useTranslations } from 'next-intl';
import ReactPlayer from 'react-player/lazy';
import { useUserAgent } from 'next-useragent';
import { ParamsContext } from '../Layout/QueryParamsContext';

interface Props {
  setshowVideo: Function;
}

function VideoContainer({ setshowVideo }: Props): ReactElement {
  const t = useTranslations('Common');
  const [videoURL, setvideoURL] = useState<null | string>(null);
  const { isContextLoaded, embed, enableIntro } = useContext(ParamsContext);
  const videoRef = useRef<ReactPlayer | null>(null);
  const handleVideoClose = () => {
    setshowVideo(false);
    if (videoRef?.current) {
      videoRef.current.seekTo(0);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('showVideo', 'false');
    }
  };

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      const agent = useUserAgent(ua);
      if (agent.isBot) {
        handleVideoClose();
      }
    }
  }, []);

  useEffect(() => {
    if (isContextLoaded && embed === 'true' && enableIntro !== 'true') {
      handleVideoClose();
    }
  }, [isContextLoaded, embed, enableIntro]);

  useEffect(() => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      switch (localStorage.getItem('language')) {
        case 'de':
          setvideoURL(
            `https://www.plant-for-the-planet.org/wp-content/videos/en-intro-mobile-planet.mp4`
          );
          break;
        case 'en':
          setvideoURL(
            `https://www.plant-for-the-planet.org/wp-content/videos/en-intro-mobile-planet.mp4`
          );
          break;
        default:
          setvideoURL(
            `https://www.plant-for-the-planet.org/wp-content/videos/en-intro-mobile-planet.mp4`
          );
      }
    } else {
      switch (localStorage.getItem('language')) {
        case 'de':
          setvideoURL(
            `https://www.plant-for-the-planet.org/wp-content/videos/en-intro-web-planet.mp4`
          );
          break;
        case 'en':
          setvideoURL(
            `https://www.plant-for-the-planet.org/wp-content/videos/en-intro-web-planet.mp4`
          );
          break;
        default:
          setvideoURL(
            `https://www.plant-for-the-planet.org/wp-content/videos/en-intro-web-planet.mp4`
          );
      }
    }
  }, []);

  useEffect((): void => {
    // See if video can play through and disable the video
    if (videoURL) {
      if (!ReactPlayer.canPlay(videoURL)) {
        handleVideoClose();
      }
    }
  }, [videoURL]);

  return isContextLoaded ? (
    <div className={styles.landingVideoSection}>
      <div className={styles.landingVideoWrapper}>
        {videoURL &&
          (ReactPlayer.canPlay(videoURL) ? (
            <ReactPlayer
              ref={videoRef}
              controls={false}
              muted={true}
              playsinline={true}
              onEnded={() => handleVideoClose()}
              config={{
                file: {
                  attributes: {
                    autoPlay: 1,
                  },
                },
              }}
              url={videoURL}
            />
          ) : null)}
      </div>
      <button
        data-test-id="skipLandingVideo"
        className={styles.landingVideoSkipButton}
        onClick={() => handleVideoClose()}
      >
        {t('skipIntroVideo')}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default VideoContainer;
