import MuiCircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { useTranslation } from 'next-i18next';
import EditIcon from '../../../../public/assets/images/icons/manageProjects/Pencil';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';
import { styled } from '@mui/material/styles';

const CircularProgress = styled(MuiCircularProgress)({
  '&.MuiCircularProgress-root': {
    color: '#fff',
    animationDuration: '550ms',
  },
  '& > svg > circle': {
    strokeLinecap: 'round',
  },
});

function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <div style={{ position: 'relative' }}>
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
  const [progress, setProgress] = React.useState(0);
  const { theme } = React.useContext(ThemeContext);

  const { t, i18n, ready } = useTranslation(['me']);
  React.useEffect(() => {
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
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>
            {localizedAbbreviatedNumber(
              i18n.language,
              Number(props.planted),
              1
            )}
          </h1>
          <h2>
            {t('me:treesPlanted_plural', {
              count: Number(props.planted),
              treeCount: getFormattedNumber(
                i18n.language,
                Number(props.planted)
              ),
            })}
          </h2>
        </div>

        {props.target ? (
          <div className={treeCounterStyles.treeCounterDataField}>
            <h1>
              {localizedAbbreviatedNumber(
                i18n.language,
                Number(props.target),
                1
              )}
            </h1>
            <div className={treeCounterStyles.target}>
              <h2
                className={
                  props.authenticatedType === 'public'
                    ? treeCounterStyles.targetText
                    : treeCounterStyles.targetTextForPrivate
                }
              >
                {t('me:target')}
              </h2>
              {props.authenticatedType === 'private' && (
                <button
                  id={'treeCounterEdit'}
                  className={treeCounterStyles.editTragetContainer}
                  onClick={() => props.handleAddTargetModalOpen()}
                >
                  <EditIcon color="white"></EditIcon>
                </button>
              )}
            </div>
          </div>
        ) : null}

        {props.authenticatedType === 'private' && props.target === 0 && (
          <button
            id={'addTarget'}
            onClick={() => props.handleAddTargetModalOpen()}
            className={treeCounterStyles.addTargetButton}
          >
            <p
              style={{
                color:
                  theme === 'theme-light'
                    ? themeProperties.light.light
                    : themeProperties.dark.dark,
              }}
            >
              {t('me:addTarget')}{' '}
            </p>
          </button>
        )}
      </div>
    </div>
  ) : null;
}
