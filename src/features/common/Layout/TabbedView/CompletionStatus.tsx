import type { ReactElement } from 'react';
import type { TabItem } from './TabbedViewTypes';

import { Box } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

interface CompletionStatusProps {
  /** Reuses the tab item's own type so the two cannot drift apart. */
  status: TabItem['completionStatus'];
}

/**
 * A small coloured disc showing whether a form section is finished.
 *
 * Absent status means not known yet, which is a real state: completeness is fetched separately from the project, so the disc is grey until it arrives. The unknown colour is transparent so it recedes on any background.
 */
export default function CompletionStatus({
  status,
}: CompletionStatusProps): ReactElement {
  const color =
    status === 'complete'
      ? 'success.main'
      : status === 'incomplete'
      ? 'error.main'
      : themeProperties.designSystem.colors.mediumGreyTransparent70; //status unknown

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: color,
      }}
    />
  );
}
