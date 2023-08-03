import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import PlayIcon from '../../../../public/assets/images/icons/PlayIcon';
import styles from './styles.module.scss';
import { useTranslation } from 'next-i18next';
import { useUserProps } from '../Layout/UserPropsContext';
import { ParamsContext } from '../Layout/QueryParamsContext';

interface Props {
  setshowVideo: Function;
}

export default function PlayButton({
  setshowVideo,
}: Props): ReactElement | null {
  const { isImpersonationModeOn } = useUserProps();
  const { embed, enableIntro, isContextLoaded } =
    React.useContext(ParamsContext);
  const { t } = useTranslation(['common']);
  const { pathname } = useRouter();

  const playButtonClasses = `${
    embed === 'true' ? styles.embed_playButton : styles.playButton
  } ${pathname === '/[p]' ? styles['playButton--reduce-right-offset'] : ''}`;

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
