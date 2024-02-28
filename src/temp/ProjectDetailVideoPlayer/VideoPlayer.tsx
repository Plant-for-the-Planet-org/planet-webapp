import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoPlayer.module.scss';
import PlayButtonIcon from '../icons/PlayButtonIcon';

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
  return ReactPlayer.canPlay(videoUrl) ? (
    <ReactPlayer
      className={styles.video}
      height={153}
      width={306} //to be replaced with 100%
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
    />
  ) : null;
};

export default VideoPlayer;
