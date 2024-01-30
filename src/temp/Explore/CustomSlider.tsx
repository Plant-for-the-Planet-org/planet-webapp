import { Slider, styled } from '@mui/material';
export const SmallSlider = styled(Slider)(() => ({
  '&.MuiSlider-root': {
    padding: '0px !important',
    position: 'static',
  },
  '.MuiSlider-thumb': {
    width: '9px !important',
    height: '9px !important',
    border: '1px solid rgba(217, 217, 217, 1)',
    color: 'rgba(255, 255, 255, 1)',
  },
  '.MuiSlider-rail': {
    height: '2.5px !important',
    backgroundColor: 'rgba(255, 255, 255, 1) !important',
  },
  '.MuiSlider-track': {
    height: '2.5px !important',
    color: 'rgba(235, 87, 87, 1)',
  },
}));
