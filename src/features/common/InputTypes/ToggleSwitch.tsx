import { Switch } from 'mui-latest';
import { styled } from 'mui-latest/styles';

export default function ToggleSwitch(props: any) {
  const ToggleSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: props.color ? props.color : '#68B030',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: props.color ? props.color : '#68B030',
    },
  });

  return (
    <ToggleSwitch
      checked={props.checked}
      onChange={props.onChange}
      id={props.id}
      inputProps={props.inputProps}
      name={props.name}
    />
  );
}
