import MuiCircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { useTranslation } from 'next-i18next';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { styled } from '@mui/material/styles';
import { PlantedTressBlackSvg } from '../../../../public/assets/images/ProfilePageIcons';

const CircularProgress = styled(MuiCircularProgress)({
  '&.MuiCircularProgress-root': {
    color: '#219653',
    animationDuration: '550ms',
  },
  '& > svg > circle': {
    strokeLinecap: 'round',
  },
});

export function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <div className={treeCounterStyles.circularProgreesContainer}>
      <CircularProgress
        variant="determinate"
        size={320}
        thickness={3}
        {...props}
      />
    </div>
  );
}

export default function TpoProfile(props: any) {
  const [progress, setProgress] = useState(0);
  const { t, i18n, ready } = useTranslation(['me']);
  useEffect(() => {
    let percentage = 0;
    if (props.target > 0) {
      percentage = (props.planted / props.target) * 100;
    } else {
      if (props.planted === '0.00' || props.planted === 0.0) percentage = 0.1;
      else percentage = 100;
    }
    if (percentage > 100) {
      percentage = 100;
    }
    const timer = setInterval(() => {
      if (percentage === 0.1) {
        setProgress(0.1);
      } else {
        setProgress((prevProgress) =>
          prevProgress >= percentage ? percentage : prevProgress + 5
        );
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [props]);
  return ready ? (
    <div className={treeCounterStyles.treeCounter}>
      <FacebookCircularProgress value={progress} />
      <div className={treeCounterStyles.backgroundCircle} />
      <div className={treeCounterStyles.treeCounterData}>
        <div>
          <PlantedTressBlackSvg />
        </div>
        <div className={treeCounterStyles.dataContainer}>
          <div>
            {localizedAbbreviatedNumber(
              i18n.language,
              Number(props.planted),
              1
            )}
          </div>
          {props?.target && <div>{'of'}</div>}

          {props?.target ? (
            <div>
              {localizedAbbreviatedNumber(
                i18n.language,
                Number(props.target),
                1
              )}
            </div>
          ) : null}
        </div>
        <div style={{ fontSize: '24px' }}>{t('me:treesPlanted')}</div>
      </div>
    </div>
  ) : null;
}
