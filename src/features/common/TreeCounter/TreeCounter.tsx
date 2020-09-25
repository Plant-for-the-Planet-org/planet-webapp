import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Sugar from 'sugar';
import treeCounterStyles from './TreeCounter.module.scss';

const useStylesFacebook = makeStyles(() => createStyles({
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
}));

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

  React.useEffect(() => {
    let percentage = (props.planted / props.target) * 100;
    if (props.planted === 0) percentage = 0.1;
    else if (props.target === 0) {
      if (props.planted === 0) percentage = 0.1;
      else percentage = 100;
    }
    if (percentage > 100) {
      percentage = 100;
    }
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= percentage ? percentage : prevProgress + 5));
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [props]);
  return (
    <div className={treeCounterStyles.treeCounter}>
      <FacebookCircularProgress value={progress} />
      <div className={treeCounterStyles.backgroundCircle} />
      {props.hideTarget && 
      <div className={treeCounterStyles.treeCounterData} style={{justifyContent: 'center'}}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>{Sugar.Number.abbr(Number(props.planted), 1)}</h1>
          <h2>Trees Planted</h2>
        </div>
      </div>
      }
      {!props.hideTarget && 
      <div className={treeCounterStyles.treeCounterData}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>{Sugar.Number.abbr(Number(props.planted), 1)}</h1>
          <h2>Trees Planted</h2>
        </div>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h1>{Sugar.Number.abbr(Number(props.target), 1)}</h1>
          <h2>Target</h2>
        </div>  
      </div>
      }
    </div>
  );
}
