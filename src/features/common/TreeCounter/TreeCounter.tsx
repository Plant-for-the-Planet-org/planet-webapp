import MuiCircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { useTranslation } from 'next-i18next';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { styled } from '@mui/material/styles';
import { PlantedTressBlackSvg } from '../../../../public/assets/images/ProfilePageIcons';
import TreeCounterDataOfTenant from './temporaryFile/TreeCounterData';
import tenantConfig from '../../../../tenant.config';

const CircularProgress = styled(MuiCircularProgress)({
  '&.MuiCircularProgress-root': {
    color: '#fff',
    animationDuration: '550ms',
  },
  '& > svg > circle': {
    strokeLinecap: 'round',
  },
});
const XCircularProgress = styled(MuiCircularProgress)({
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
        size={330}
        thickness={3}
        {...props}
      />
    </div>
  );
}
export function TenantCircularProgress(props: CircularProgressProps) {
  return (
    <div className={treeCounterStyles.circularProgreesContainer}>
      <XCircularProgress
        variant="determinate"
        size={330}
        thickness={3}
        {...props}
      />
    </div>
  );
}

export default function TpoProfile(props: any) {
  const config = tenantConfig();
  const [progress, setProgress] = useState(0);
  const [isTenantActive, setIsTenantActive] = useState(false);
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

  const _tenants = [
    'nitrosb',
    'energizer',
    'senatDerWirtschaft',
    'pampers',
    'interactClub',
    'culchacandela',
    'xiting',
    'lacoqueta',
    'ulmpflanzt',
    'sitex',
    '3pleset',
    'weareams',
  ];

  useEffect(() => {
    const _activeTenant = _tenants.some((tenant) => {
      return process.env.TENANT === tenant;
    });
    if (_activeTenant) setIsTenantActive(true);
  }, [isTenantActive]);

  return ready ? (
    <div className={treeCounterStyles.treeCounter}>
      {isTenantActive ? (
        <FacebookCircularProgress value={progress} />
      ) : (
        <TenantCircularProgress value={progress} />
      )}

      <div
        className={treeCounterStyles.backgroundCircle}
        style={{ borderColor: isTenantActive ? '#fff' : '#6FCF97' }}
      />

      {isTenantActive ? (
        <TreeCounterDataOfTenant
          planted={props?.planted}
          target={props.target}
        />
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
                  Number(props.planted),
                  1
                )}
              </div>
            )}
            {props?.target !== 0 && <div>{'of'}</div>}
            {props?.target !== 0 && (
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
