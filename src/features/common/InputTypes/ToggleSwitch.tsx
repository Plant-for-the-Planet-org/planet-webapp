import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

export default function ToggleSwitch(props: any) {
  const ToggleSwitch = withStyles({
    switchBase: {
      color: '#fff',
      '&$checked': {
        color: props.color ? props.color : '#89B53A',
      },
      '&$checked + $track': {
        backgroundColor: props.color ? props.color : '#89B53A',
      },
    },
    checked: {},
    track: {},
  })(Switch);
  return (
    <ToggleSwitch
      checked={props.checked}
      onChange={props.onChange}
      name={props.name}
      inputProps={props.inputProps}
    />
  );
}

//export default ToggleSwitch;
