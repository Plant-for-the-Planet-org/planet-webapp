import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import tenantConfig from '../../../../tenant.config';
const config = tenantConfig();

const MaterialTextField = withStyles({
  root: {
    width: '100%',
    '& label.Mui-focused': {
      color: '#2F3336',
      fontFamily: config!.font.primaryFontFamily,
    },
    '& label': {
      color: '#2F3336',
      fontFamily: config!.font.primaryFontFamily,
      fontSize: '14px',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0px!important',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F2F2F7',
      border: '0px!important',
      borderRadius: '10px',
      fontFamily: config!.font.primaryFontFamily,
    },
  },
})(TextField);

export default MaterialTextField;
