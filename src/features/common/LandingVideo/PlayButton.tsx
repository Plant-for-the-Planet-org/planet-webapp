import React, { ReactElement } from 'react';
import PlayIcon from '../../../../public/assets/images/icons/PlayIcon';
import styles from './styles.module.scss';

interface Props {
    setshowVideo: Function;
}

export default function PlayButton({setshowVideo}: Props): ReactElement {
    return (
        <div onClick={()=>setshowVideo(true)} className={styles.playButton}>
            <PlayIcon/>
        </div>
    )
}
