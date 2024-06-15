import { styled } from '@mui/material';
import { TextField } from '@mui/material';

interface TextFieldProps {
  focusColor: string;
}

const TargetTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})<TextFieldProps>((p) => ({
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

export default TargetTextField;
