import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import styles from '../styles/VideoPlayer.module.scss';
import PlayButtonIcon from '../../../../temp/icons/PlayButtonIcon';

const PlayButton = () => {
  return (
    <div className={styles.playButtonBackdrop}>
      <PlayButtonIcon width={15} />
    </div>
  );
};

interface Props {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: Props) => {
  const [calcWidth, setCalcWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const newWindowDimensions = {
        width: 310,
        height: 153,
      };

      if (window.innerWidth <= 431) {
        setCalcWidth(window.innerWidth - 32);
      } else {
        setCalcWidth(newWindowDimensions.width);
      }
    };

    // Initial setup
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return ReactPlayer.canPlay(videoUrl) ? (
    <div className={styles.videoContainer}>
      <ReactPlayer
        className={styles.video}
        height={(calcWidth / 16) * 9}
        width={calcWidth}
        loop={true}
        light={true}
        controls={true}
        playIcon={<PlayButton />}
        config={{
          youtube: {
            playerVars: { autoPlay: 1 },
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
  ) : null;
};

export default VideoPlayer;
