import React from 'react';
import themeProperties from '../../../theme/themeProperties';
import { LinearProgress, styled } from '@mui/material';

const ProgressBar = styled(LinearProgress)({
  '&.MuiLinearProgress-root': {
    backgroundColor: themeProperties.designSystem.colors.baseGrey,
  },
  '& > .MuiLinearProgress-bar': {
    backgroundColor: themeProperties.designSystem.colors.warmGreen,
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
