import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import {
  getFormattedNumber,
  localizedAbbreviatedNumber,
} from '../../../utils/getFormattedNumber';
import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStylesFacebook = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    top: {
      color: '#4BCA81',
      animationDuration: '550ms',
    },
    circle: {
      strokeLinecap: 'round',
    },
  })
);

function FacebookCircularProgress(props: CircularProgressProps) {
  const classes = useStylesFacebook();
  const { isMobile } = props;

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="static"
        // disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={330}
        thickness={4}
        {...props}
      />
    </div>
  );
}

export default function TpoProfile(props: any) {
  const [progress, setProgress] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState<boolean>(true);

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

  // sets [isMobile] to true if the device width is less than 768 else false
  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);
  return (
    <div className={treeCounterStyles.treeCounter} style={{marginTop:'60px'}}>
      <div className={treeCounterStyles.backgroundCircle}></div>
      <div className={treeCounterStyles.treeCounterData}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h2 className={treeCounterStyles.countNumber}>
            {getFormattedNumber('en-IN', Number(props.planted))}
          </h2>
          <h2 className={treeCounterStyles.countLabel}>Saplings planted</h2>
          <h2 className={treeCounterStyles.countNumber}>
            {getFormattedNumber('en-IN', Number(props.target))}
          </h2>
          <h2 className={treeCounterStyles.countLabel}>Target</h2>
        </div>
      </div>
      <FacebookCircularProgress value={progress} />
    </div>
  );
}
