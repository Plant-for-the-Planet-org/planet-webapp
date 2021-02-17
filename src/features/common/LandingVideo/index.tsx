import React, { ReactElement } from 'react'
import styles from './styles.module.scss'
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

interface Props {
    setshowVideo: Function;
}

function VideoContainer({ setshowVideo }: Props): ReactElement {
    const { t, ready } = useTranslation(['common']);

    const [isUploading, setisUploading] = React.useState(false)
    const handleVideoClose = () => {
        setshowVideo(false);
        setisUploading(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('hidePreview', true)
        }
    }
    return ready ? (
        <div className={styles.landingVideoSection}>
            <div className={styles.landingVideoWrapper}>
                <video muted autoPlay onEnded={() => handleVideoClose()}>
                    <source src={"/assets/video/landing.mp4"} type="video/mp4" />
                </video>
            </div>
            <button className={styles.landingVideoSkipButton} onClick={() => handleVideoClose()}>
                {isUploading ? <div className={styles.spinner}></div> : t('common:skipIntroVideo')}
            </button>
        </div>
    ) : (<></>)
}

export default VideoContainer
