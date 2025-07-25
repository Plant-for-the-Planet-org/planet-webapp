import { Switch, styled } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

interface SwitchProps {
  customColor?: string;
}

const baseSwitchStyle = {
  '.MuiSwitch-track': {
    height: '10px', // Increased from 7px
    width: '27px', // Increased from 18px
  },
  '.MuiSwitch-thumb': {
    width: '16px', // Increased from 11px
    height: '16px', // Increased from 11px
  },
  '.MuiSwitch-switchBase': {
    padding: '1px',
  },
  '&.MuiSwitch-root': {
    width: '57px', // Increased from 38px
    height: '39px', // Increased from 26px
    padding: '4px', // Slightly increased from 3px
  },
  '.MuiSwitch-switchBase.Mui-checked': {
    transform: 'translateX(16px)', // Increased from 11px to match new dimensions
  },
};

const { primaryColor } = themeProperties.designSystem.colors;

const SmallSwitch = styled(Switch)(() => ({
  ...baseSwitchStyle,
}));

export const StyledSwitch = styled(SmallSwitch, {
  shouldForwardProp: (prop) => prop !== 'customColor',
})<SwitchProps>(({ customColor }) => ({
  '.MuiSwitch-switchBase.Mui-checked': {
    color: customColor || primaryColor,
  },
  '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: customColor || primaryColor,
  },
}));
