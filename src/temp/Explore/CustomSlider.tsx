import { Slider, styled } from '@mui/material';
import theme from '../../theme/themeProperties';
const { light, nonDonatableProjectBackgroundColor } = theme;
export const SmallSlider = styled(Slider)(() => ({
  '&.MuiSlider-root': {
    padding: '0px',
  },
  '.MuiSlider-thumb': {
    width: '9px',
    height: '9px',
    border: '1px solid rgba(217, 217, 217, 1)',
    color: `${light.light}`,
  },
  '.MuiSlider-thumb.Mui-active': {
    boxShadow:
      '0px 0px 0px 14px rgba(var(--deforestration-range-background-new), 0.1)',
  },
  '.MuiSlider-rail': {
    height: '2.5px',
    backgroundColor: `${nonDonatableProjectBackgroundColor}`,
  },
  '.MuiSlider-track': {
    height: '2.5px',
    color: `${'rgba(var(--deforestration-range-background-new))'}`,
  },
  '.MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover': {
    boxShadow: `0px 0px 0px 14px rgba(var(--deforestration-range-background-new), 0.1)`,
  },
}));
