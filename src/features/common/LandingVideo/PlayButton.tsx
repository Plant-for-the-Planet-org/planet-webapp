import React, { ReactElement } from 'react';
import PlayIcon from '../../../../public/assets/images/icons/PlayIcon';
import styles from './styles.module.scss';
import i18next from '../../../../i18n';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;

interface Props {
    setshowVideo: Function;
}

export default function PlayButton({setshowVideo}: Props): ReactElement {
    const router = useRouter();
    console.log(router.query);
    const { t } = useTranslation(['common']);
    return (
        <div title={t('howDoesThisWork')} onClick={()=>setshowVideo(true)} className={router.query.embed === 'true'? styles.embed_playButton: styles.playButton}>
            <PlayIcon/>
        </div>
    )
}
