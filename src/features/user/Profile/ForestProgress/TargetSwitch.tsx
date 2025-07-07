import { Switch } from '@mui/material';
import { styled } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

interface TargetSwitchProps {
  switchColor: string;
}
const { white, softText2 } = themeProperties.designSystem.colors;

const TargetSwitch = styled(Switch, {
  shouldForwardProp: (props) => props !== 'switchColor',
})<TargetSwitchProps>((p) => ({
  width: 32,
  height: 16.76,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(15px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(15px)',
      color: white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: `${p.switchColor}`,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 13,
    height: 13,
    borderRadius: 6,
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: softText2,
    boxSizing: 'border-box',
  },
}));

export default TargetSwitch;
