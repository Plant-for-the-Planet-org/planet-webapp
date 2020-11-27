import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Sugar from 'sugar';
import treeCounterStyles from './TreeCounter.module.scss';
import i18next from '../../../../i18n';
import EditIcon from '../../../../public/assets/images/icons/manageProjects/Pencil';

const { useTranslation } = i18next;

const useStylesFacebook = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
    },
    top: {
      color: '#fff',
      animationDuration: '550ms',
    },
    circle: {
      strokeLinecap: 'round',
    },
  })
);

function FacebookCircularProgress(props: CircularProgressProps) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="static"
        // disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={320}
        thickness={3}
        {...props}
      />
    </div>
  );
}

export default function TpoProfile(props: any) {
  const [progress, setProgress] = React.useState(0);

  const { t } = useTranslation(['me']);
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
  return (
    <div className={treeCounterStyles.treeCounter}>
      <FacebookCircularProgress value={progress} />
      <div className={treeCounterStyles.backgroundCircle} />
      <div className={treeCounterStyles.treeCounterData}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>{Sugar.Number.abbr(Number(props.planted), 1)}</h1>
          <h2>{t('me:treesPlanted')}</h2>
        </div>
        
        {props.target ? (
          <div className={treeCounterStyles.treeCounterDataField}>
            <h1>{Sugar.Number.abbr(Number(props.target), 1)}</h1>
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
                <div
                  className={treeCounterStyles.editTragetContainer}
                  onClick={() => props.handleAddTargetModalOpen()}
                >
                  <EditIcon color="white"></EditIcon>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {props.authenticatedType === 'private' && props.target === 0 && (
          <div
            onClick={() => props.handleAddTargetModalOpen()}
            className={treeCounterStyles.addTargetButton}
          >
            <p>{t('me:addTarget')} </p>
          </div>
        )}
      </div>
    </div>
  );
}
