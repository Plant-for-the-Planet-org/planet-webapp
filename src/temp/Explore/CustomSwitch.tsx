import { Switch, styled } from '@mui/material';

interface SwitchProps {
  currentForestSwitch?: boolean;
  restorationSwitch?: boolean;
  deforestrationSwitch?: boolean;
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

const SmallSwitch = styled(Switch)(({}) => ({
  ...baseSwitchStyle,
}));

export const StyledSwitch = styled(SmallSwitch)<SwitchProps>(
  ({ currentForestSwitch, restorationSwitch, deforestrationSwitch }) => ({
    '.MuiSwitch-switchBase.Mui-checked': {
      color:
        (currentForestSwitch && 'rgba(33, 150, 83, 1)') ||
        (restorationSwitch && 'rgba(47, 128, 237, 1)') ||
        (deforestrationSwitch && 'rgba(235, 87, 87, 1)'),
    },
    '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
      backgroundColor:
        (currentForestSwitch && 'rgb(202, 230, 214)') ||
        (restorationSwitch && 'rgb(205, 225, 251)') ||
        (deforestrationSwitch && 'rgb(250, 215, 215)'),
    },
  })
);
