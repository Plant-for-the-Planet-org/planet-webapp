import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Gift from './../../../assets/images/navigation/Gift'
import {
    withStyles,
  } from '@material-ui/core/styles';

interface State {
  password: string;
}

const InputAdornments=()=> {
  const [values, setValues] = React.useState<State>({
    password: '',
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={'text'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                //   onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  <Gift />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
  );
}

const MaterialTextFeild = withStyles({
    root: {
      width:'100%',
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
        fontFamily:'Raleway',
        
      },
    },
  })(InputAdornments);

export default MaterialTextFeild