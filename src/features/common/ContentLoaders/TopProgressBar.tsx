import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import theme from '../../../theme/themeProperties';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  colorPrimary: {
    backgroundColor: theme.light.blueishGrey,
  },
  barColorPrimary: {
    backgroundColor: theme.primaryColor,
  },
});

interface Props {
  progress: number;
}

export default function TopProgressBar({ progress }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <LinearProgress
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
        color="primary"
        variant="determinate"
        value={progress}
      />
    </div>
  );
}
