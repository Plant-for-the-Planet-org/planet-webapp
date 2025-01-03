import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../../theme/themeProperties';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement> | undefined;
  name?: string;
  color?: string;
}

export default function ToggleSwitch(props: ToggleSwitchProps) {
  const ToggleSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: props.color ? props.color : theme.primaryColor,
    },
    track: {
      backgroundColor: '#787878',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: props.color ? props.color : theme.primaryColor,
    },
  });

  return (
    <ToggleSwitch
      checked={props.checked}
      onChange={props.onChange}
      id={props.id}
      inputProps={props.inputProps}
      name={props.name}
      disabled={props.disabled || false}
    />
  );
}
