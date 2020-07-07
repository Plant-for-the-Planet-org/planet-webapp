import {
    withStyles,
  } from '@material-ui/core/styles';
  import TextField from '@material-ui/core/TextField';
const MaterialTextFeild = withStyles({
    root: {
      '& label.Mui-focused': {
        color: '#2F3336',
        fontFamily:'Raleway'
      },
      '& label': {
        color: '#2F3336',
        fontFamily:'Raleway'
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-notchedOutline':{
        border:'0px!important',
      },
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#F2F2F7',
        border:'0px!important',
        borderRadius:'10px',
        fontFamily:'Raleway'
      },
    },
  })(TextField);

export default MaterialTextFeild
