import React from 'react';
import theme from '../../../theme/themeProperties';
import { LinearProgress, styled } from '@mui/material';

const ProgressBar = styled(LinearProgress)({
  '&.MuiLinearProgress-root': {
    backgroundColor: theme.light.backgroundColorDark,
  },
  '& > .MuiLinearProgress-bar': {
    backgroundColor: theme.primaryColor,
  },
});

interface Props {
  progress: number;
}

export default function TopProgressBar({ progress }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <ProgressBar color="primary" variant="determinate" value={progress} />
    </div>
  );
}
