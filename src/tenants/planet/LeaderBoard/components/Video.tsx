import React, { ReactElement } from 'react'
import styles from './Video.module.scss'
import i18next from '../../../../../i18n';
import ReactPlayer from 'react-player/lazy';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';

interface Props {
    
}

const { useTranslation } = i18next;
function Video({}: Props): ReactElement {
  const { t, ready } = useTranslation(['leaderboard', 'common']);

  const videoUrl = 'https://www.youtube.com/watch?v=9V981RXcmH8'
    return ready ? (
        <div className={styles.videoSection}>
          <div className={styles.videoTitle}>
            <h2>{t('leaderboard:videoTitle')}</h2> 
            <button id={'backArrowVideoT'}><BackArrow /></button>
          </div>
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
    ) : <></>;
}

export default Video
