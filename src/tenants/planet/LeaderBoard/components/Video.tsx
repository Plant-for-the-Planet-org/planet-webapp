// Not used currently. Left as a reference.
import React, { ReactElement } from 'react';
import styles from './Video.module.scss';
import { useTranslation } from 'next-i18next';
import ReactPlayer from 'react-player/lazy';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';

function Video(): ReactElement {
  const { t, ready } = useTranslation(['leaderboard', 'common']);

  const videoUrl = 'Some dummy url (to be replaced)';
  return ready ? (
    <div className={styles.videoSection}>
      <div className={styles.videoTitle}>
        <h2>{t('leaderboard:videoTitle')}</h2>
        <button id="backArrowVideoT" className={styles.backArrowVideoT}>
          <BackArrow />
        </button>
      </div>
      <div className={styles.videoContainerWrapper}>
        <div className={styles.videoContainer}>
          {ReactPlayer.canPlay(videoUrl) ? (
            <ReactPlayer
              className={styles.video}
              height={'100%'}
              width={'100%'}
              loop={true}
              light={true}
              controls={true}
              config={{
                youtube: {
                  playerVars: { autoPlay: 1 },
                },
              }}
              url={videoUrl}
            />
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Video;

/* Note: Video may need to be blocked in certain countries. This is a possible list of countries that was used earlier
const blockedCountries =  [
	"CK",
	"TH",
	"KW",
	"CN",
	"TL",
	"AF",
	"KH",
	"TW",
	"CY",
	"MM",
	"MO",
	"MN",
	"ID",
	"OM",
	"WS",
	"IQ",
	"SA",
	"IR",
	"SG",
	"QA",
	"MY",
	"FM",
	"BH",
	"AE",
	"BN",
	"TO",
	"YE",
	"HK",
	"JO",
	"LB",
	"MT",
	"LA",
	"PG",
	"VN",
	"LY",
	"SY"
]
 */
