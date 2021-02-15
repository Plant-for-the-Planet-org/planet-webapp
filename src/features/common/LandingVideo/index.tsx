import React, { ReactElement } from 'react'
import styles from './styles.module.scss'
interface Props {
    setshowVideo: Function;
}

function VideoContainer({ setshowVideo }: Props): ReactElement {

    const [isUploading, setisUploading] = React.useState(false)
    const handleVideoClose = () => {
        setshowVideo(false);
        setisUploading(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('hidePreview', true)
        }
    }
    return (
        <div className={styles.landingVideoSection}>
            <div className={styles.landingVideoWrapper}>
                <iframe src="https://player.vimeo.com/video/76979871?background=1&autoplay=1&loop=1&byline=0&title=0"
                    frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
            <button className={styles.landingVideoSkipButton} onClick={() => handleVideoClose()}>{isUploading ? <div className={styles.spinner}></div> : 'Skip Video'}</button>
        </div>
    )
}

export default VideoContainer
