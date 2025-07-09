import type { TooltipProps } from '@mui/material';

import { Tooltip, styled, tooltipClasses } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

// Could be updated for reuse, but currently only needed for the GiftInfo tooltip

const GiftInfoTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: themeProperties.designSystem.colors.white,
    color: themeProperties.designSystem.colors.softText,
    fontSize: themeProperties.fontSizes.fontXXSmall,
    borderRadius: 12,
    padding: 8,
    boxShadow: '10px 10px 10px 0px #2F2F2F1A, 0px 0px 10px 0px #2F2F2F1A',
  },
}));

export default GiftInfoTooltip;
