import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

const GreenRadio = withStyles({
  root: {
    color: '#000000',
    '&$checked': {
      color: '#89B53A',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export default GreenRadio;
