import React, { ReactElement } from 'react'
import styles from './Video.module.scss'
import i18next from '../../../../../i18n';
import ReactPlayer from 'react-player/lazy';

interface Props {
    
}

function Video({}: Props): ReactElement {
    const { useTranslation } = i18next;
  const { t } = useTranslation(['leaderboard', 'common']);

  const videoUrl = 'https://www.youtube.com/watch?v=RKK7wGAYP6k'
    return (
        <div className={styles.videoSection}>
            <h2>{t('leaderboard:videoTitle')}</h2>
            <div className={styles.videoContainerWrapper}>
            <div className={styles.videoContainer}>
                {ReactPlayer.canPlay(videoUrl) ? (
                <ReactPlayer
                  className={styles.video}
                  height={"100%"}
                  width={"100%"}
                  loop={true}
                  light={true}
                  controls={true}
                  config={{
                    youtube: {
                      playerVars: { autoplay: 1 },
                    },
                  }}
                  url={videoUrl}
                />
              ) : null}
            </div>
            </div>
           
        </div>
    )
}

export default Video
