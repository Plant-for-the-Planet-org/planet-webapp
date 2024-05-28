import { Switch } from '@mui/material';
import { styled } from '@mui/material';

interface CustomTargetSwitchProps {
  switchColor: string;
}

const CustomTargetSwitch = styled(Switch, {
  shouldForwardProp: (props) => props !== 'switchColor',
})<CustomTargetSwitchProps>((p) => ({
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
      color: '#fff',
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
    backgroundColor: 'rgba(130, 130, 130, 1)',
    boxSizing: 'border-box',
  },
}));

export default CustomTargetSwitch;
