import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import tenantConfig from '../../../../tenant.config';
const config = tenantConfig();

const MaterialTextField = withStyles({
  root: {
    width: '100%',
    color: 'var(--primary-font-color)',
    '& .MuiInputBase-input.MuiOutlinedInput-input':{
      color: 'var(--primary-font-color)',
    },
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
      backgroundColor: 'var(--background-color-dark)',
      color: 'var(--primary-font-color)',
      border: '0px!important',
      borderRadius: '10px',
      fontFamily: config!.font.primaryFontFamily,
    },
    '& .MuiOutlinedInput-input':{
      padding:'14px'
  },
  '& .MuiOutlinedInput-multiline':{
    padding:'0px'
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]':{
    padding:'14px'
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':{
    padding:'0px'
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child':{
    paddingLeft:'0px'
  }
  },
  
},)(TextField);

export default MaterialTextField;
