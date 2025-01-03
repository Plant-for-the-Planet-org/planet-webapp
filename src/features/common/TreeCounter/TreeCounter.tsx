import type { CircularProgressProps } from '@mui/material/CircularProgress';

import MuiCircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { styled } from '@mui/material/styles';
import { PlantedTressBlackSvg } from '../../../../public/assets/images/ProfilePageIcons';
import HomeTreeCounter from './legacy/TreeCounterData';
import theme from '../../../theme/themeProperties';
import { _tenants } from '../../../utils/constants/HomeTreeCounter';
import { useTenant } from '../Layout/TenantContext';

const { primaryColorNew, light } = theme;

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
    color: `${primaryColorNew}`,
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
        size={342}
        thickness={3}
        {...props}
      />
    </div>
  );
}

interface TpoProfileInterface {
  handleAddTargetModalOpen: () => void;
  planted: number;
  restoredAreaUnit: number;
  target: number;
}

export default function TpoProfile(props: TpoProfileInterface) {
  const [progress, setProgress] = useState(0);
  const [isHomeTreeCounter, setIsHomeTreeCounter] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const t = useTranslations('Me');
  const locale = useLocale();
  const { tenantConfig } = useTenant();

  const _isTreeTarget = () => {
    if (props?.target !== 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const svgHeight = screenSize.width < 400 ? 15 : 33;
  const svgWidth = screenSize.width < 400 ? 20 : 43;

  useEffect(() => {
    let percentage = 0;
    if (props.target > 0) {
      percentage = (props.planted / props.target) * 100;
    } else {
      if (String(props.planted) === '0.00' || props.planted === 0.0)
        percentage = 0.1;
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
      return tenantConfig.config.slug === tenant;
    });
    if (_tenantHasHomeTreeCounter) setIsHomeTreeCounter(true);
  }, [isHomeTreeCounter]);
  return (
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
            <PlantedTressBlackSvg
              color={'#4F4F4F'}
              height={svgHeight}
              width={svgWidth}
            />
          </div>
          <div className={treeCounterStyles.dataContainer}>
            {_isTreeTarget() ? (
              t('treesOfTrees', {
                count1: localizedAbbreviatedNumber(
                  locale,
                  Number(props.planted - props.restoredAreaUnit),
                  2
                ),
                count2: localizedAbbreviatedNumber(
                  locale,
                  Number(props.target),
                  1
                ),
              })
            ) : (
              <div>
                {localizedAbbreviatedNumber(
                  locale,
                  Number(props.planted - props.restoredAreaUnit),
                  2
                )}
              </div>
            )}
          </div>
          <div className={treeCounterStyles.treesPlanted}>
            {t('treesPlanted')}
          </div>
        </div>
      )}
    </div>
  );
}
