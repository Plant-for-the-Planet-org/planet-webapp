import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/VideoPlayer.module.scss';
import PlayButtonIcon from '../../../../temp/icons/PlayButtonIcon';
import ReactPlayer from 'react-player/lazy';

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
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Initial setup
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const { height, width } = playerDimensions;
  return ReactPlayer.canPlay(videoUrl) ? (
    <div ref={containerRef} className={styles.videoContainer}>
      <ReactPlayer
        className={styles.video}
        height={height}
        width={width}
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
