import React, { ReactElement } from 'react'
import styles from './styles.module.scss'
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

interface Props {
    setshowVideo: Function;
}

function VideoContainer({ setshowVideo }: Props): ReactElement {
    const { t, ready, i18n } = useTranslation(['common']);
    const [videoURL, setvideoURL] = React.useState("/assets/video/landing.mp4")
    const [isUploading, setisUploading] = React.useState(false)
    const handleVideoClose = () => {
        setshowVideo(false);
        setisUploading(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('hidePreview', true)
        }
    }

    React.useEffect(() => {
        var screenWidth = window.innerWidth;

        if (screenWidth < 480) {
            switch (localStorage.getItem('language')) {
                case 'de': setvideoURL("/assets/video/landingMobileDe.mp4"); break;
                case 'en': setvideoURL("/assets/video/landingMobile.mp4"); break;
                default: setvideoURL("/assets/video/landingMobile.mp4");
            }
        } else {
            switch (localStorage.getItem('language')) {
                case 'de': setvideoURL("/assets/video/landingDe.mp4"); break;
                case 'en': setvideoURL("/assets/video/landing.mp4"); break;
                default: setvideoURL("/assets/video/landing.mp4");
            }
        }
    }, [])
    return ready ? (
        <div className={styles.landingVideoSection}>
            <div className={styles.landingVideoWrapper}>
                <video preload={"metadata"} muted autoPlay playsInline onEnded={() => handleVideoClose()}>
                    <source src={videoURL} type="video/mp4" />
                </video>
            </div>
            <button className={styles.landingVideoSkipButton} onClick={() => handleVideoClose()}>
                {isUploading ? <div className={styles.spinner}></div> : t('common:skipIntroVideo')}
            </button>
        </div>
    ) : (<></>)
}

export default VideoContainer
