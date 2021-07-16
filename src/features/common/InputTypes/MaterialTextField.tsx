import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import tenantConfig from '../../../../tenant.config';
const config = tenantConfig();

const MaterialTextField = withStyles({
  root: {
    width: '100%',
    '& label.Mui-focused': {
      color: 'var(--primary-font-color)',
      fontFamily: config!.font.primaryFontFamily,
    },
    '& label': {
      color: 'var(--primary-font-color)',
      fontFamily: config!.font.primaryFontFamily,
      fontSize: '14px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0px!important',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--blueish-grey)',
      color: 'var(--primary-font-color)',
      border: '0px!important',
      borderRadius: '10px',
      fontFamily: config!.font.primaryFontFamily,
    },
  },
})(TextField);

export default MaterialTextField;
