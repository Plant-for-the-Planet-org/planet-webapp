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
                <iframe src="https://player.vimeo.com/video/512607409?background=1&autoplay=1&loop=1&byline=0&title=0"
                    frameBorder="0" allowFullScreen></iframe>
            </div>
            <button className={styles.landingVideoSkipButton} onClick={() => handleVideoClose()}>
                {isUploading ? <div className={styles.spinner}></div> : t('common:skipIntroVideo')}
            </button>
        </div>
    ) : (<></>)
}

export default VideoContainer
