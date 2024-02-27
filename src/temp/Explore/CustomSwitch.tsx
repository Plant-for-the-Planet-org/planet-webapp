import { Switch, styled } from '@mui/material';

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

export const CurrentForestSwitch = styled(SmallSwitch)(({}) => ({
  '.MuiSwitch-switchBase.Mui-checked': {
    color: 'rgba(33, 150, 83, 1)',
  },
  '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: '#CAE6D6',
  },
}));

export const RestorationSwitch = styled(SmallSwitch)(({}) => ({
  '.MuiSwitch-switchBase.Mui-checked': {
    color: 'rgba(47, 128, 237, 1)',
  },
  '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: '#CDE1FB',
  },
}));

export const DeforestrationSwitch = styled(SmallSwitch)(({}) => ({
  '.MuiSwitch-track': {
    color: 'black',
  },
  '.MuiSwitch-switchBase.Mui-checked': {
    color: 'rgba(235, 87, 87, 1)',
  },
  '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: '#FAD7D7',
  },
}));
export const ProjectSwitch = styled(Switch)(baseSwitchStyle);
