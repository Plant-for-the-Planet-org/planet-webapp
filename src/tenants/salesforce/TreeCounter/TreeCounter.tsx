import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import Sugar from 'sugar';
import treeCounterStyles from './TreeCounter.module.scss';

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

function FacebookCircularProgress(props: any) {
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
        size={isMobile ? 206 : 340}
        thickness={isMobile ? 3.6 : 4.6}
        {...props}
      />
    </div>
  );
}

export default function TpoProfile(props: any) {
  const [progress, setProgress] = React.useState(0);
  const isMobile = window.innerWidth <= 768;

  React.useEffect(() => {
    let percentage = (props.planted / props.target) * 100;
    if (props.planted === 0) percentage = 0.1;
    else if (props.target === 0) {
      if (props.planted === 0) percentage = 0.1;
      else percentage = 100;
    }
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= percentage ? percentage : prevProgress + 5
      );
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [props]);
  return (
    <div className={treeCounterStyles.treeCounter}>
      <div className={treeCounterStyles.backgroundCircle}></div>
      <div className={treeCounterStyles.treeCounterData}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>{Sugar.Number.abbr(Number(props.planted), 1)}</h1>
          <h2>Trees Planted by the Salesforce Community</h2>
        </div>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>{Sugar.Number.abbr(Number(props.target), 1)}</h1>
          <h2>Target</h2>
        </div>
      </div>
      <FacebookCircularProgress value={50} isMobile={isMobile} />
    </div>
  );
}
