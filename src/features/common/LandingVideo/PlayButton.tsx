import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import PlayIcon from '../../../../public/assets/images/icons/PlayIcon';
import styles from './styles.module.scss';
<<<<<<< HEAD
import { useTranslation } from 'next-i18next';
=======
import i18next from '../../../../i18n';
import { ParamsContext } from '../Layout/QueryParamsContext';

const { useTranslation } = i18next;
>>>>>>> develop

interface Props {
  setshowVideo: Function;
}

export default function PlayButton({ setshowVideo }: Props): ReactElement {
<<<<<<< HEAD
  const { t } = useTranslation(['common']);
=======
  const { embed } = React.useContext(ParamsContext);
  const { t } = useTranslation(['common']);
  const { pathname } = useRouter();

  const playButtonClasses = `${
    embed === 'true' ? styles.embed_playButton : styles.playButton
  } ${pathname === '/[p]' ? styles['playButton--reduce-right-offset'] : ''}`;
>>>>>>> develop
  return (
    <div
      title={t('howDoesThisWork')}
      onClick={() => setshowVideo(true)}
<<<<<<< HEAD
      className={styles.playButton}
=======
      className={playButtonClasses}
>>>>>>> develop
    >
      <PlayIcon />
    </div>
  );
}
