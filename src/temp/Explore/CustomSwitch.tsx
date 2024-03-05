import { Switch, styled } from '@mui/material';
import theme from '../../theme/themeProperties';
const {
  primaryColorNew,
  restorationToggleColorNew,
  exploreRangeSliderColorNew,
  currentForestSwitchTrackColorNew,
  restorationSwitchTrackColorNew,
  deforestrationSwitchTrackColorNew,
} = theme;
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
        (currentForestSwitch && `${primaryColorNew}`) ||
        (restorationSwitch && `${restorationToggleColorNew}`) ||
        (deforestrationSwitch && `${exploreRangeSliderColorNew}`),
    },
    '.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
      backgroundColor:
        (currentForestSwitch && `${currentForestSwitchTrackColorNew}`) ||
        (restorationSwitch && `${restorationSwitchTrackColorNew}`) ||
        (deforestrationSwitch && `${deforestrationSwitchTrackColorNew}`),
    },
  })
);
