import type { ReactElement } from 'react';

import { useContext } from 'react';
import { useRouter } from 'next/router';
import PlayIcon from '../../../../public/assets/images/icons/PlayIcon';
import styles from './styles.module.scss';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../Layout/UserPropsContext';
import { ParamsContext } from '../Layout/QueryParamsContext';

interface Props {
  setshowVideo: Function;
}

export default function PlayButton({
  setshowVideo,
}: Props): ReactElement | null {
  const { isImpersonationModeOn } = useUserProps();
  const { embed, enableIntro, isContextLoaded } = useContext(ParamsContext);
  const t = useTranslations('Common');
  const router = useRouter();

  const playButtonClasses = `${
    embed === 'true' ? styles.embed_playButton : styles.playButton
  } ${
    router.pathname === '/projects-archive/[p]' ||
    router.pathname === '/sites/[slug]/[locale]/projects-archive/[p]'
      ? styles['playButton--reduce-right-offset']
      : ''
  }`;

  const canShowPlayButton = !(embed === 'true' && enableIntro !== 'true');

  return isContextLoaded && canShowPlayButton ? (
    <div
      title={t('howDoesThisWork')}
      onClick={() => setshowVideo(true)}
      className={playButtonClasses}
      style={{ marginTop: isImpersonationModeOn ? '45px' : '' }}
    >
      <PlayIcon />
    </div>
  ) : null;
}
