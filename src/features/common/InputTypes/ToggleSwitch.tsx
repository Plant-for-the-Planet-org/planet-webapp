import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const ToggleSwitch = withStyles({
  switchBase: {
    color: '#fff',
    '&$checked': {
      color: '#89B53A',
    },
    '&$checked + $track': {
      backgroundColor: '#89B53A',
    },
  },
  checked: {},
  track: {},
})(Switch);

export default ToggleSwitch;
