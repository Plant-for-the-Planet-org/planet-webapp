// Was used for YearRangeSlider in MapFeatureExplorer. Can be removed if no longer needed.

import { Slider, styled } from '@mui/material';
import themeProperties from '../../../../../theme/themeProperties';
const { colors } = themeProperties.designSystem;
export const SmallSlider = styled(Slider)(() => ({
  '&.MuiSlider-root': {
    padding: '0px',
  },
  '.MuiSlider-thumb': {
    width: '9px',
    height: '9px',
    border: `1px solid ${colors.mediumGrey}`,
    color: colors.white,
  },
  '.MuiSlider-thumb.Mui-active': {
    boxShadow: `0px 0px 0px 14px ${colors.fireRedTransparent10}`,
  },
  '.MuiSlider-rail': {
    height: '2.5px',
    backgroundColor: colors.mediumGreyTransparent70,
  },
  '.MuiSlider-track': {
    height: '2.5px',
    color: colors.fireRed,
  },
  '.MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover': {
    boxShadow: `0px 0px 0px 14px ${colors.fireRedTransparent10}`,
  },
}));
