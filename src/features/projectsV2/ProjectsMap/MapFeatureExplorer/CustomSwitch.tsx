import { Switch, styled } from '@mui/material';

interface SwitchProps {
  customColor?: string;
}

const baseSwitchStyle = {
  '.MuiSwitch-track': {
    height: '7px',
    width: '18px',
  },
  '.MuiSwitch-thumb': {
    width: '11px',
    height: '11px',
  },
  '.MuiSwitch-switchBase': {
    padding: '1px',
  },
  '&.MuiSwitch-root': {
    width: '38px',
    height: '26px',
    padding: '3px',
  },
  '.MuiSwitch-switchBase.Mui-checked': {
    transform: 'translateX(11px)',
  },
};

const SmallSwitch = styled(Switch)(() => ({
  ...baseSwitchStyle,
}));

export const StyledSwitch = styled(SmallSwitch, {
  shouldForwardProp: (prop) => prop !== 'customColor',
})<SwitchProps>(({ customColor }) => ({
  '.MuiSwitch-switchBase.Mui-checked': {
    color: customColor,
  },
  '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: customColor,
  },
}));
