import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import themeProperties from '../../../theme/themeProperties';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement> | undefined;
  name?: string;
  color?: string;
}

const StyledSwitch = styled(Switch)({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: themeProperties.designSystem.colors.forestGreen,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: themeProperties.designSystem.colors.white,
      border: `6px solid ${themeProperties.designSystem.colors.white}`,
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      background: themeProperties.designSystem.colors.mediumGreyTransparent30,
      opacity: 1,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    backgroundColor: themeProperties.designSystem.colors.white,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: themeProperties.designSystem.colors.mediumGrey,
    opacity: 1,
  },
});

export default function NewToggleSwitch(props: ToggleSwitchProps) {
  return (
    <StyledSwitch
      checked={props.checked}
      onChange={props.onChange}
      id={props.id}
      inputProps={props.inputProps}
      name={props.name}
      disabled={props.disabled || false}
    />
  );
}
