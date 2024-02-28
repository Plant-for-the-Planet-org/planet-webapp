import { Slider, styled } from '@mui/material';
export const SmallSlider = styled(Slider)(() => ({
  '&.MuiSlider-root': {
    padding: '0px',
    position: 'static',
  },
  '.MuiSlider-thumb': {
    width: '9px',
    height: '9px',
    border: '1px solid rgba(217, 217, 217, 1)',
    color: 'rgba(255, 255, 255, 1)',
  },
  '.MuiSlider-rail': {
    height: '2.5px',
    backgroundColor: '#828282',
  },
  '.MuiSlider-track': {
    height: '2.5px',
    color: 'rgba(235, 87, 87, 1)',
  },
  '.MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover': {
    boxShadow: 'none',
  },
}));
