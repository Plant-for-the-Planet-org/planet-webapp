import MuiCircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { useTranslation } from 'next-i18next';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { styled } from '@mui/material/styles';
import { PlantedTressBlackSvg } from '../../../../public/assets/images/ProfilePageIcons';
import HomeTreeCounter from './temporaryFile/TreeCounterData';
import theme from '../../../theme/themeProperties';
import { _tenants } from '../../../utils/constants/HomeTreeCounter';

const { primaryDarkColorX, light } = theme;

const CircularProgress = styled(MuiCircularProgress)({
  '&.MuiCircularProgress-root': {
    color: `${light.light}`,
    animationDuration: '550ms',
  },
  '& > svg > circle': {
    strokeLinecap: 'round',
  },
});
const XCircularProgress = styled(MuiCircularProgress)({
  '&.MuiCircularProgress-root': {
    color: `${primaryDarkColorX}`,
    animationDuration: '550ms',
  },
  '& > svg > circle': {
    strokeLinecap: 'round',
  },
});

export function ProfileCircularProgress(props: CircularProgressProps) {
  return (
    <div className={treeCounterStyles.circularProgressContainer}>
      <CircularProgress
        variant="determinate"
        size={330}
        thickness={3}
        {...props}
      />
    </div>
  );
}
export function HomeCircularProgress(props: CircularProgressProps) {
  return (
    <div className={treeCounterStyles.circularProgressContainer}>
      <XCircularProgress
        variant="determinate"
        size={322}
        thickness={3}
        {...props}
      />
    </div>
  );
}

export default function TpoProfile(props: any) {
  const [progress, setProgress] = useState(0);
  const [isHomeTreeCounter, setIsHomeTreeCounter] = useState(false);
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

  useEffect(() => {
    const _tenantHasHomeTreeCounter = _tenants.some((tenant) => {
      return process.env.TENANT === tenant;
    });
    if (_tenantHasHomeTreeCounter) setIsHomeTreeCounter(true);
  }, [isHomeTreeCounter]);

  return ready ? (
    <div className={treeCounterStyles.treeCounter}>
      {isHomeTreeCounter ? (
        <ProfileCircularProgress value={progress} />
      ) : (
        <HomeCircularProgress value={progress} />
      )}

      <div
        className={
          isHomeTreeCounter
            ? treeCounterStyles.backgroundCircle
            : treeCounterStyles.backgroundCircleForTenant
        }
      />

      {isHomeTreeCounter ? (
        <HomeTreeCounter planted={props?.planted} target={props.target} />
      ) : (
        <div className={treeCounterStyles.treeCounterData}>
          <div>
            <PlantedTressBlackSvg color={'#4F4F4F'} />
          </div>
          <div className={treeCounterStyles.dataContainer}>
            {props?.planted && (
              <div>
                {localizedAbbreviatedNumber(
                  i18n.language,
                  Number(props.planted - props.restoredAreaUnit),
                  1
                )}
              </div>
            )}
            {props.target !== undefined && props.target !== 0 && (
              <div>{'of'}</div>
            )}
            {props && props.target !== undefined && props.target !== 0 && (
              <div>
                {localizedAbbreviatedNumber(
                  i18n.language,
                  Number(props.target),
                  1
                )}
              </div>
            )}
          </div>
          <div style={{ fontSize: '24px' }}>{t('me:treesPlanted')}</div>
        </div>
      )}
    </div>
  ) : null;
}
