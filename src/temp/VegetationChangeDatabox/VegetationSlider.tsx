import { Box, Typography, styled } from '@mui/material';
import Slider from '@mui/material/Slider';
import React from 'react';

interface Props {
  position: number;
}

const StyledSlider = styled(Slider)(() => {
  return {
    background:
      'linear-gradient(270deg, #219653 0%, #FFF 49.48%, #BDBDBD 75.52%, #E86F56 100%)',
    borderRadius: 2,
    height: 11.636,
    padding: 0,
    width: 184,
    '& .MuiSlider-thumb': {
      width: 11.74,
      height: 11.74,
      marginTop: 8,
      '&:hover, &.Mui-focusVisible': {
        boxShadow: 'none',
      },
    },
    '& .MuiSlider-rail': {
      display: 'none',
    },
    '& .MuiSlider-track': {
      display: 'none',
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 6,
      top: 36,
      backgroundColor: 'unset',
      '& .labelText': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#828282',
        '& span': {
          fontWeight: 700,
          color: '#4F4F4F',
        },
      },
    },
  };
});

const VegetationSlider = ({ position }: Props) => {
  function getLabelText(value: number) {
    return (
      <div className="labelText">
        <span>Average</span> +{value} tons
      </div>
    );
  }
  return (
    <div>
      <StyledSlider
        aria-label="vegetation-slider"
        value={position}
        min={-20}
        max={20}
        valueLabelFormat={getLabelText}
        valueLabelDisplay="on"
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 184,
          fontSize: 8,
          color: '#4F4F4F',
          fontWeight: 600,
        }}
      >
        <Typography>-20 tons</Typography>
        <Typography>20 tons</Typography>
      </Box>
    </div>
  );
};

export default VegetationSlider;
