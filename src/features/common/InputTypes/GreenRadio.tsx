import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';

const GreenRadio = withStyles({
  root: {
    color: '#000000',
    '&$checked': {
      color: '#68B030',
    },
  },
  checked: {
    '& .MuiSvgIcon-root path': {
      fill: '#68B030',
    },
  },
})((props) => <Radio color="default" {...props} />);

export default GreenRadio;
