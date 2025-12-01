import { useState, useEffect, useRef } from 'react';
import styles from '../styles/VideoPlayer.module.scss';
import PlayButtonIcon from '../../../../../public/assets/images/icons/projectV2/PlayButtonIcon';
import ReactPlayer from 'react-player/lazy';
import { useTranslations } from 'next-intl';
import WebappButton from '../../../common/WebappButton';
import { isYouTubeDomain } from '../../../../utils/youTubeValidation';

const PlayButton = () => {
  return (
    <div className={styles.playButtonBackdrop}>
      <PlayButtonIcon width={15} />
    </div>
  );
};

interface Props {
  videoUrl: string;
  hasConsent: boolean;
  onConsentChange: (hasConsent: boolean) => void;
  backgroundImage?: string;
}

const VideoPlayer = ({
  videoUrl,
  hasConsent,
  onConsentChange,
  backgroundImage,
}: Props) => {
  const tVideoPlayer = useTranslations('ProjectDetails.videoPlayer');
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's from YouTube domain
    const fromYouTube = isYouTubeDomain(videoUrl);
    setIsYouTubeVideo(fromYouTube);
  }, [videoUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setPlayerDimensions({
          width: containerWidth,
          height: (containerWidth / 16) * 9,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoadVideo = () => {
    onConsentChange(true);
  };

  const { height, width } = playerDimensions;

  // For YouTube URLs (any YouTube content), show consent placeholder if no consent given
  if (isYouTubeVideo && !hasConsent) {
    return (
      <div className={styles.videoConsentContainer}>
        <div
          className={`${styles.consentBackground} ${
            backgroundImage ? styles.hasBackgroundImage : ''
          }`}
          style={
            backgroundImage
              ? { backgroundImage: `url(${backgroundImage})` }
              : undefined
          }
        >
          <div className={styles.consentContent}>
            <WebappButton
              elementType="button"
              onClick={handleLoadVideo}
              text={tVideoPlayer('loadVideo')}
              variant="primary"
              buttonClasses={styles.consentButton}
            />
            <small className={styles.consentText}>
              {tVideoPlayer.rich('consentText', {
                googlePrivacyLink: (chunks) => (
                  <a
                    target="_blank"
                    href="https://policies.google.com/privacy"
                    rel="noopener noreferrer"
                    className="planet-links"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {chunks}
                  </a>
                ),
              })}
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (!ReactPlayer.canPlay(videoUrl)) {
    return null;
  }

  // Show the actual video player (for non-YouTube videos or after consent)
  return (
    <div ref={containerRef} className={styles.videoContainer}>
      <ReactPlayer
        className={styles.video}
        height={height}
        width={width}
        loop={true}
        light={!isYouTubeVideo}
        controls={true}
        playIcon={<PlayButton />}
        config={{
          youtube: {
            playerVars: { autoplay: 1, rel: 0 },
          },
        }}
        url={videoUrl}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: -20,
          opacity: 1,
        }}
      />
    </div>
  );
};

export default VideoPlayer;
