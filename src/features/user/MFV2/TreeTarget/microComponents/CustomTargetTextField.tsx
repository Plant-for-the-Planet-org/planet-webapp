import { styled } from '@mui/material';
import { TextField } from '@mui/material';

interface CustomTextFieldProps {
  focusColor: string;
}

const CustomTargetTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})<CustomTextFieldProps>((p) => ({
  '.mui-style-i6b3x2-MuiInputBase-root-MuiOutlinedInput-root': {
    borderRadius: '10px',
    height: '42px',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: p.focusColor,
    },
  },
}));

export default CustomTargetTextField;
