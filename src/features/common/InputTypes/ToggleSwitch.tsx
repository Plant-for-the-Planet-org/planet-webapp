import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../../theme/themeProperties';

export default function ToggleSwitch(props: any) {
  const ToggleSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: props.color ? props.color : theme.primaryColor,
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: props.color ? props.color : theme.primaryColor,
    },
  });

    checked: {},
    track: {
      backgroundColor: '#787878',
    },
  })(Switch);
  return (
    <ToggleSwitch
      checked={props.checked}
      onClick={props.onChange}
      id={props.id}
      inputProps={props.inputProps}
      name={props.name}
    />
  );
}
