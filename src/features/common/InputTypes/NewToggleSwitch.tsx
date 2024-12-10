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

export default function NewToggleSwitch(props: ToggleSwitchProps) {
  const NewToggleSwitch = styled(Switch)({
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
          backgroundColor: theme.primaryColorNew,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: theme.light,
        border: `6px solid ${theme.light}`,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        background: '#E0E0E0', //TODO: add to theme
        opacity: 1,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
      backgroundColor: theme.light,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#BDBDBD', //TODO: add to theme
      opacity: 1,
    },
  });

  return (
    <NewToggleSwitch
      checked={props.checked}
      onChange={props.onChange}
      id={props.id}
      inputProps={props.inputProps}
      name={props.name}
      disabled={props.disabled || false}
    />
  );
}
